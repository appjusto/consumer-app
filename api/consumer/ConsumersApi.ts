import { documentsAs } from '@/common/firebase/documentAs';
import { serverTimestamp } from '@/common/firebase/serverTimestamp';
import { Place, WithId } from '@appjusto/types';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';
import AuthApi from '../auth/AuthApi';

// firestore
const placesRef = () => firestore().collection('places');
const placeRef = (id: string) => placesRef().doc(id);

export default class ConsumersApi {
  constructor(private auth: AuthApi) {}
  // account
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
      if (error instanceof Error) crashlytics().recordError(error);
      throw new Error('Não foi possível obter seus endereços. Tente novamente mais tarde.');
    }
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
}
