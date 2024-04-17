import { documentAs, documentsAs } from '@/common/firebase/documentAs';
import { PublicCourier } from '@appjusto/types';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';

// firestore
const publicRef = () => firestore().collection('public').doc('subcollections');
const couriersRef = () => publicRef().collection('couriers');

export default class CouriersApi {
  // profile
  async fetchCourierById(courierId: string) {
    try {
      const query = couriersRef().doc(courierId);
      const snapshot = await query.get();
      if (!snapshot.exists) return null;
      return documentAs<PublicCourier>(snapshot);
    } catch (error: unknown) {
      if (error instanceof Error) crashlytics().recordError(error);
      return null;
    }
  }
  async fetchCourierByCode(code: string) {
    try {
      const query = couriersRef().where('code', '==', code).limit(1);
      const snapshot = await query.get();
      if (snapshot.empty) return null;
      return documentsAs<PublicCourier>(snapshot.docs)[0];
    } catch (error: unknown) {
      if (error instanceof Error) crashlytics().recordError(error);
      return null;
    }
  }

  getSelfiePath(size?: string, courierId?: string) {
    return `couriers/${courierId}/selfie${size ? `_${size}x${size}` : ''}.jpg`;
  }
}
