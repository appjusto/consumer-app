import { documentAs, documentsAs } from '@/common/firebase/documentAs';
import { serverTimestamp } from '@/common/firebase/serverTimestamp';
import { getInstallationId } from '@/common/security/getInstallationId';
import { getAppVersion } from '@/common/version';
import { getFirebaseRegion } from '@/extra';
import {
  ConsumerProfile,
  ProfileChange,
  UpdateCodePayload,
  UserProfile,
  WithId,
} from '@appjusto/types';
import firebase from '@react-native-firebase/app';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { hash } from 'geokit';
import { Platform } from 'react-native';
import AuthApi from '../auth/AuthApi';

// functions
const region = getFirebaseRegion();
const updateCode = firebase.app().functions(region).httpsCallable('updateCode');

// firestore
const profileRef = (id: string) => firestore().collection('consumers').doc(id);
const usersRef = () => firestore().collection('users');
const usersSubcollectionsRef = () => usersRef().doc('subcollections');
const usersChangesRef = () => usersSubcollectionsRef().collection('changes');

export default class ProfileApi {
  constructor(
    private auth: AuthApi,
    public justSubmitted: boolean = false
  ) {}

  // public API
  async createProfile(id: string) {
    // console.log('createProfile', id);
    await profileRef(id).set(
      {
        situation: 'pending',
        email: this.auth.getEmail() ?? null,
        phone: this.auth.getPhoneNumber(true) ?? null,
        createdOn: firestore.FieldValue.serverTimestamp(),
      } as UserProfile,
      { merge: true }
    );
  }
  // observe profile changes
  observeProfile(id: string, resultHandler: (profile: WithId<ConsumerProfile> | null) => void) {
    // console.log('observeProfile', id);
    return profileRef(id).onSnapshot(async (snapshot) => {
      if (!snapshot) return; // happens when profile is deleted
      // console.log('profile.exists', snapshot.exists);
      if (!snapshot.exists) {
        await this.createProfile(id);
        // resultHandler(null);
      } else {
        resultHandler(documentAs<ConsumerProfile>(snapshot));
      }
    });
  }
  // update profile
  async updateProfile(changes: Partial<ConsumerProfile>, retry = 5) {
    const consumerId = this.auth.getUserId();
    if (!consumerId) return null;
    const appVersion = getAppVersion();
    const appInstallationId = await getInstallationId();
    const update: Partial<UserProfile> = {
      ...changes,
      appVersion,
      appInstallationId,
      platform: Platform.OS,
      updatedOn: serverTimestamp(),
    };
    try {
      await profileRef(consumerId).update(update);
    } catch (error) {
      if (retry > 0) {
        setTimeout(() => this.updateProfile(changes, retry - 1), 2000);
      } else {
        throw error;
      }
    }
  }

  async submitProfile() {
    const consumerId = this.auth.getUserId()!;
    this.justSubmitted = true;
    await profileRef(consumerId).update({
      situation: 'submitted',
      updatedOn: serverTimestamp(),
    } as Partial<ConsumerProfile>);
  }

  async fixProfile() {
    const consumerId = this.auth.getUserId()!;
    await profileRef(consumerId).update({
      situation: 'pending',
      updatedOn: serverTimestamp(),
    } as Partial<ConsumerProfile>);
  }

  async updateLocation(location: FirebaseFirestoreTypes.GeoPoint) {
    const update: Partial<UserProfile> = {
      coordinates: location,
      g: {
        geopoint: location,
        geohash: hash({
          lat: location.latitude,
          lng: location.longitude,
        }),
      },
      updatedOn: serverTimestamp(),
    };
    await this.updateProfile(update);
  }

  async requestProfileChange(changes: Partial<ProfileChange>) {
    await usersChangesRef().add({
      userType: 'consumer',
      situation: 'pending',
      createdOn: serverTimestamp(),
      ...changes,
    });
  }

  async observePendingChange(
    id: string,
    resultHandler: (profile: WithId<ProfileChange> | null) => void
  ) {
    const query = usersChangesRef()
      .where('accountId', '==', id)
      .where('situation', '==', 'pending')
      .limit(1);
    return query.onSnapshot(
      (snapshot) => {
        if (snapshot.empty) {
          resultHandler(null);
        } else {
          resultHandler(documentsAs<ProfileChange>(snapshot.docs)[0]);
        }
      },
      (error) => {
        console.error(error);
        // Sentry.Native.captureException(error);
      }
    );
  }

  // functions
  async updateCode(code: string) {
    console.log('updateCode', code);
    const response = await updateCode({
      code,
      flavor: 'consumer',
      meta: { version: getAppVersion() },
    } as UpdateCodePayload);
    if ('error' in response.data) throw new Error(response.data.error);
  }

  // storage

  getSelfiePath(size?: string, consumerId?: string) {
    return `consumers/${consumerId ?? this.auth.getUserId()}/selfie${
      size ? `_${size}x${size}` : ''
    }.jpg`;
  }
  getDocumentPath(size?: string) {
    const consumerId = this.auth.getUserId();
    if (!consumerId) return null;
    return `consumers/${consumerId}/document${size ? `_${size}x${size}` : ''}.jpg`;
  }
}
