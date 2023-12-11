import { documentAs, documentsAs } from '@/common/firebase/documentAs';
import { serverTimestamp } from '@/common/firebase/serverTimestamp';
import { getFirebaseRegion } from '@/extra';
import {
  Order,
  OrderItem,
  OrderReview,
  OrderStatus,
  Place,
  PublicBusiness,
  WithId,
} from '@appjusto/types';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import { omit } from 'lodash';
import AuthApi from '../auth/AuthApi';
import { fromDate } from '../firebase/timestamp';
import { addBusinessToOrder } from './business/toOrderBusiness';

// functions
const region = getFirebaseRegion();
const cancelOrder = firebase.app().functions(region).httpsCallable('cancelOrder');

// firestore
const ordersRef = () => firestore().collection('orders');
const orderRef = (id: string) => ordersRef().doc(id);
const reviewsRef = () => firestore().collection('reviews');
const reviewRef = (id: string) => reviewsRef().doc(id);

// API
export interface ObserveOrdersOptions {
  statuses?: OrderStatus[];
  businessId?: string;
  from?: Date;
  to?: Date;
  limit?: number;
}

export default class OrdersApi {
  constructor(private auth: AuthApi) {}
  // observe orders
  observeOrders(options: ObserveOrdersOptions, resultHandler: (orders: WithId<Order>[]) => void) {
    console.log('observeOrders', options);
    const { statuses, businessId, from, to, limit } = options;
    let query = ordersRef()
      .where('consumer.id', '==', this.auth.getUserId())
      .orderBy('createdOn', 'desc');
    if (statuses) query = query.where('status', 'in', statuses);
    if (businessId) query = query.where('business.id', '==', businessId);
    if (from) query = query.where('createdOn', '>', fromDate(from));
    if (to) query = query.where('createdOn', '<', fromDate(to));
    if (limit) query = query.limit(limit);

    return query.onSnapshot(
      async (snapshot) => {
        console.log('observeOrders snapshot', snapshot.size);
        resultHandler(snapshot.empty ? [] : documentsAs<Order>(snapshot.docs));
      },
      (error) => {
        console.error(error);
      }
    );
  }

  observeOrder(orderId: string, resultHandler: (orders: WithId<Order> | null) => void) {
    const query = orderRef(orderId);
    return query.onSnapshot(
      async (snapshot) => {
        resultHandler(snapshot.exists ? documentAs<Order>(snapshot) : null);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  async createFoodOrder(
    business: WithId<PublicBusiness>,
    items: OrderItem[] = [],
    destination: Place
  ) {
    const payload = addBusinessToOrder(
      {
        type: 'food',
        status: 'quote',
        fulfillment: 'delivery',
        dispatchingStatus: 'idle',
        dispatchingState: null,
        consumer: {
          id: this.auth.getUserId()!,
        },
        destination,
        createdOn: serverTimestamp(),
        items,
      },
      business
    );
    const ref = ordersRef().doc();
    await ref.set(payload);
    return ref.id;
  }

  async updateOrder(orderId: string, update: Partial<Order>) {
    console.log('updating order', orderId, JSON.stringify(update));
    // TODO: track
    await orderRef(orderId).update(update);
  }

  async deleteOrder(orderId: string) {
    await orderRef(orderId).delete();
  }

  // reviews
  observeOrderReview(orderId: string, resultHandler: (orders: WithId<OrderReview> | null) => void) {
    const query = reviewsRef()
      .where('orderId', '==', orderId)
      .where('createdBy.id', '==', this.auth.getUserId());
    return query.onSnapshot(
      async (snapshot) => {
        if (snapshot.empty) {
          resultHandler(null);
        } else {
          resultHandler(documentsAs<OrderReview>(snapshot.docs)[0]);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  async setOrderReview(orderId: string, review: Partial<WithId<OrderReview>>) {
    const reviewId = review.id ?? reviewsRef().doc().id;
    await reviewRef(reviewId).set(
      {
        ...omit(review, ['id']),
        orderId,
        createdBy: {
          id: this.auth.getUserId(),
          flavor: 'consumer',
        },
        reviewedOn: serverTimestamp(),
      } as OrderReview,
      { merge: true }
    );
  }
}
