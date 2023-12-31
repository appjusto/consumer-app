import { documentsAs } from '@/common/firebase/documentAs';
import { getFirebaseRegion } from '@/extra';
import {
  Cuisine,
  Issue,
  IssueType,
  PlatformAccess,
  PlatformFees,
  PlatformParams,
} from '@appjusto/types';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import AuthApi from '../auth/AuthApi';

// functions
const region = getFirebaseRegion();
export const getServerTime = firebase.app().functions(region).httpsCallable('getServerTime');

// firestore
export const platformRef = () => firestore().collection('platform');
export const platformParamsRef = () => platformRef().doc('params');
export const platformAccessRef = () => platformRef().doc('access');
export const platformFeesRef = () => platformRef().doc('fees');
// platform data
export const platformDataRef = () => platformRef().doc('data');
export const cuisinesRef = () => platformDataRef().collection('cuisines');
export const issuesRef = () => platformDataRef().collection('issues');
// platform logs
export const platformLogsRef = () => platformRef().doc('logs');

// API
export default class PlatformApi {
  constructor(private auth: AuthApi) {}
  async getServerTime(): Promise<number> {
    try {
      if (this.auth.getUserId()) {
        const result = await getServerTime();
        return (result.data as any).time;
      }
    } catch (error) {
      console.error('getServerTime');
      console.error(error);
    }
    return new Date().getTime();
  }

  async fetchPlatformParams() {
    const snapshot = await platformParamsRef().get();
    return snapshot.data() as PlatformParams;
  }

  async fetchPlatformAccess() {
    const snapshot = await platformAccessRef().get();
    return snapshot.data() as PlatformAccess;
  }

  async fetchPlatformFees() {
    const snapshot = await platformFeesRef().get();
    return snapshot.data() as PlatformFees;
  }

  async fetchCuisines() {
    const snapshot = await cuisinesRef().orderBy('order', 'asc').get();
    return documentsAs<Cuisine>(snapshot.docs);
  }

  async fetchIssues(type: IssueType) {
    const snapshot = await issuesRef().where('type', '==', type).orderBy('order', 'asc').get();
    return snapshot.docs.map((doc) => doc.data() as Issue);
  }
}
