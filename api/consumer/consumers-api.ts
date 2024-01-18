import { documentAs, documentsAs } from '@/common/firebase/documentAs';
import { serverTimestamp } from '@/common/firebase/serverTimestamp';
import { getAppVersion } from '@/common/version';
import { getFirebaseRegion, getManifestExtra } from '@/extra';
import { Card, Place, SaveIuguCardPayload, SaveVRCardPayload, WithId } from '@appjusto/types';
import firebase from '@react-native-firebase/app';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';
import { CancelToken } from 'axios';
import * as Crypto from 'expo-crypto';
import { trim } from 'lodash';
import AuthApi from '../auth/AuthApi';
import IuguApi from '../externals/iugu/iugu-api';
import { CardInfo } from './cards/types';

const extra = getManifestExtra();

// functions
const region = getFirebaseRegion();
const saveCard = firebase.app().functions(region).httpsCallable('saveCard');
const deleteCard = firebase.app().functions(region).httpsCallable('deleteCard');

// firestore
const placesRef = () => firestore().collection('places');
const placeRef = (id: string) => placesRef().doc(id);
const cardsRef = () => firestore().collection('cards');

export default class ConsumersApi {
  private _iugu: IuguApi;
  constructor(private auth: AuthApi) {
    this._iugu = new IuguApi(extra.iugu.accountId, extra.env !== 'live');
  }
  // places
  async fetchPlaces() {
    try {
      const query = placesRef()
        .where('accountId', '==', this.auth.getUserId())
        .orderBy('updatedAt', 'desc');
      const snapshot = await query.get();
      if (snapshot.empty) return [];
      return documentsAs<Place>(snapshot.docs);
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) crashlytics().recordError(error);
      throw new Error('Não foi possível obter seus endereços. Tente novamente mais tarde.');
    }
  }
  observePlaces(resultHandler: (orders: WithId<Place>[]) => void) {
    const query = placesRef()
      .where('accountId', '==', this.auth.getUserId())
      .orderBy('updatedAt', 'desc');
    return query.onSnapshot(
      async (snapshot) => {
        resultHandler(snapshot.empty ? [] : documentsAs<Place>(snapshot.docs));
      },
      (error) => {
        console.error(error);
        if (error instanceof Error) crashlytics().recordError(error);
      }
    );
  }
  async createPlace(place: Partial<Place>) {
    await placesRef()
      .doc()
      .update({
        ...place,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      } as Place);
  }
  async updatePlace(place: WithId<Place>) {
    await placeRef(place.id).update({
      ...place,
      updatedAt: serverTimestamp(),
    } as Place);
  }
  async deletePlace(place: WithId<Place>) {
    await placeRef(place.id).delete();
  }
  // cards
  observeCards(resultHandler: (orders: WithId<Card>[]) => void) {
    const query = cardsRef()
      .where('accountId', '==', this.auth.getUserId())
      .where('status', '==', 'enabled')
      .orderBy('createdAt', 'desc');
    return query.onSnapshot(
      async (snapshot) => {
        resultHandler(snapshot.empty ? [] : documentsAs<Card>(snapshot.docs));
      },
      (error) => {
        console.log(error);
      }
    );
  }
  async fetchCard(cardId: string) {
    try {
      const ref = cardsRef().doc(cardId);
      const snapshot = await ref.get();
      if (!snapshot.exists) return null;
      return documentAs<Card>(snapshot);
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) crashlytics().recordError(error);
      throw new Error('Não foi possível obter seus endereços. Tente novamente mais tarde.');
    }
  }
  async saveCard(data: CardInfo, cancelToken?: CancelToken) {
    const { processor, name, number, month, year, cvv } = data;
    const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, number);
    if (processor === 'iugu') {
      const firstName = trim(name.split(' ', 1).toString());
      const lastName = trim(name.split(' ').splice(1).join(' '));
      const paymentToken = await this._iugu.createPaymentToken(
        {
          first_name: firstName,
          last_name: lastName,
          number,
          month,
          year,
          verification_value: cvv,
        },
        cancelToken
      );
      if (!paymentToken) throw new Error('Não foi possível salvar o cartão de crédito.');
      const result = await saveCard({
        processor: 'iugu',
        cardTokenId: paymentToken.id,
        hash,
        meta: { version: getAppVersion() },
      } as SaveIuguCardPayload);
      const cardId = result.data.id as string;
      return cardId;
    } else if (processor === 'vr') {
      const result = await saveCard({
        processor: 'vr',
        name,
        number,
        month: parseInt(month, 10),
        year: parseInt(year, 10),
        cvv,
        meta: { version: getAppVersion() },
      } as SaveVRCardPayload);
      const cardId = result.data.id as string;
      return cardId;
    }
    throw new Error('Não foi possível identificar a bandeira.');
  }
  async deleteCard(id: string) {
    await deleteCard({
      id,
      meta: { version: getAppVersion() },
    });
  }
}
