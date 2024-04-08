import { documentsAs } from '@/common/firebase/documentAs';
import { Payment, WithId } from '@appjusto/types';
import firestore from '@react-native-firebase/firestore';
import AuthApi from '../../auth/AuthApi';

// firestore
const paymentsRef = () => firestore().collection('payments');

export default class PaymentsApi {
  constructor(private auth: AuthApi) {}
  // observe orders
  observePendingPayment(orderId: string, resultHandler: (payment: WithId<Payment> | null) => void) {
    console.log('observePendingPayment', orderId);
    const query = paymentsRef()
      .where('from.accountId', '==', this.auth.getUserId())
      .where('order.id', '==', orderId)
      .where('status', '==', 'pending')
      .orderBy('createdAt', 'desc')
      .limit(1);

    return query.onSnapshot(
      async (snapshot) => {
        console.log('observePendingPayment:', snapshot.size);
        if (snapshot.empty) resultHandler(null);
        else resultHandler(documentsAs<Payment>(snapshot.docs)[0]);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
