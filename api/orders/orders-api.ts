import { documentAs, documentsAs } from '@/common/firebase/documentAs';
import { serverTimestamp } from '@/common/firebase/serverTimestamp';
import { getAppVersion } from '@/common/version';
import { getFirebaseRegion } from '@/extra';
import {
  Fare,
  GetCancellationInfoResult,
  GetOrderQuotesPayload,
  Issue,
  Order,
  OrderCancellation,
  OrderConfirmation,
  OrderCourierLocationLog,
  OrderPayments,
  OrderReview,
  PayableWith,
  Place,
  PublicBusiness,
  UpdateOrderCouponPayload,
  WithId,
} from '@appjusto/types';
import firebase from '@react-native-firebase/app';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';
import { omit } from 'lodash';
import { LatLng } from 'react-native-maps';
import AuthApi from '../auth/AuthApi';
import { fromDate } from '../firebase/timestamp';
import { addBusinessToOrder } from './business/toOrderBusiness';
import { AllOrdersStatuses } from './status';
import { ObserveOrdersOptions, PlaceOrderOptions } from './types';

// functions
const region = getFirebaseRegion();
const getOrderQuotes = firebase.app().functions(region).httpsCallable('getOrderQuotes');
const placeOrder = firebase.app().functions(region).httpsCallable('placeOrder');
const updateOrderCoupon = firebase.app().functions(region).httpsCallable('updateOrderCoupon');
const getCancellationInfo = firebase.app().functions(region).httpsCallable('getCancellationInfo');
const cancelOrder = firebase.app().functions(region).httpsCallable('cancelOrder');

// firestore
const ordersRef = () => firestore().collection('orders');
const orderRef = (id: string) => ordersRef().doc(id);
const privateRef = (id: string) => orderRef(id).collection('private');
const logsRef = (id: string) => orderRef(id).collection('logs');
const confirmationRef = (id: string) => privateRef(id).doc('confirmation');
const paymentsRef = (id: string) => privateRef(id).doc('payments');
const cancellationRef = (id: string) => privateRef(id).doc('cancellation');
const reviewsRef = () => firestore().collection('reviews');
const reviewRef = (id: string) => reviewsRef().doc(id);

export default class OrdersApi {
  constructor(private auth: AuthApi) {}
  // observe orders
  observeOrders(options: ObserveOrdersOptions, resultHandler: (orders: WithId<Order>[]) => void) {
    console.log('observeOrders', options);
    const { statuses = AllOrdersStatuses, businessId, type, from, to, limit } = options;
    let query = ordersRef()
      .where('consumer.id', '==', this.auth.getUserId())
      .where('status', 'in', statuses)
      .orderBy('createdOn', 'desc');
    if (businessId) query = query.where('business.id', '==', businessId);
    if (type) query = query.where('type', '==', type);
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

  observeOrder(
    orderId: string,
    resultHandler: (orders: WithId<Order> | null) => void
    // commitedOnly = false
  ) {
    console.log('observeOrder', orderId);
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

  async createFoodOrder(business: WithId<PublicBusiness>, order: Partial<Order>) {
    const payload = addBusinessToOrder(
      {
        type: 'food',
        placedFrom: 'mobile',
        status: 'quote',
        fulfillment: 'delivery',
        dispatchingStatus: 'idle',
        dispatchingState: null,
        consumer: {
          id: this.auth.getUserId()!,
        },
        createdOn: serverTimestamp(),
        ...order,
      },
      business
    );
    const ref = ordersRef().doc();
    await ref.set(payload);
    return ref.id;
  }

  async createP2POrder(origin: Place) {
    console.log('createP2POrder');
    const payload: Partial<Order> = {
      type: 'p2p',
      placedFrom: 'mobile',
      status: 'quote',
      fulfillment: 'delivery',
      dispatchingStatus: 'idle',
      dispatchingState: null,
      consumer: {
        id: this.auth.getUserId()!,
      },
      origin,
      createdOn: serverTimestamp(),
    };
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
    console.log('deleteOrder', orderId);
    await orderRef(orderId).delete();
  }

  async getOrderQuotes(
    orderId: string,
    paymentMethod: PayableWith,
    fleetsIds: string[] | undefined
  ) {
    console.log('getOrderQuotes', {
      orderId,
      paymentMethod,
    });
    try {
      const response = await getOrderQuotes({
        orderId,
        paymentMethod,
        useCredits: true,
        fleetsIds,
        meta: { version: getAppVersion() },
      } as GetOrderQuotesPayload);
      const fares = response.data as Fare[];
      console.log('getOrderQuotes completed');
      return fares;
    } catch (error) {
      console.log(error);
      console.log(JSON.stringify(error));
      console.error('getOrderQuotes error');
      return [];
    }
  }

  async updateCoupon(orderId: string, code: string) {
    console.log('updateCoupon', orderId, code);
    const response = await updateOrderCoupon({
      orderId,
      code,
      meta: { version: getAppVersion() },
    } as UpdateOrderCouponPayload);
    if ('error' in response.data) throw new Error(response.data.error);
  }

  async placeOrder(options: PlaceOrderOptions) {
    console.log('placeOrder', options);
    await placeOrder({
      ...options,
      // payment: {
      //   payableWith: 'cash',
      // },
      meta: { version: getAppVersion() },
    });
  }

  // confirmation
  observeConfirmation(orderId: string, resultHandler: (confirmation: OrderConfirmation) => void) {
    confirmationRef(orderId).onSnapshot(
      (snapshot) => {
        resultHandler(snapshot.data() as OrderConfirmation);
      },
      (error) => {
        console.error(error);
        crashlytics().recordError(error);
      }
    );
  }

  // payment
  observePayment(orderId: string, resultHandler: (payment: OrderPayments) => void) {
    paymentsRef(orderId).onSnapshot(
      (snapshot) => {
        resultHandler(snapshot.data() as OrderPayments);
      },
      (error) => {
        console.error(error);
        crashlytics().recordError(error);
      }
    );
  }

  // courier locatio
  observeCourierLocation(
    orderId: string,
    courierId: string,
    resultHandler: (order: LatLng | null) => void
  ) {
    const query = logsRef(orderId)
      .where('type', '==', 'courier-location')
      .where('courierId', '==', courierId)
      .orderBy('timestamp', 'desc');
    return query.onSnapshot(
      async (snapshot) => {
        if (snapshot.empty) {
          resultHandler(null);
        } else {
          const doc = snapshot.docs[0].data() as OrderCourierLocationLog;
          resultHandler(doc.location);
        }
      },
      (error) => {
        console.error(error);
      }
    );
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

  // cancellation

  async getCancellationInfo(orderId: string) {
    console.log('getCancellationInfo', orderId);
    const response = await getCancellationInfo({
      orderId,
      meta: { version: getAppVersion() },
    });
    return response.data as GetCancellationInfoResult;
  }

  async cancelOrder(
    orderId: string,
    acknowledgedCosts: number,
    cancellation?: WithId<Issue>,
    comment?: string
  ) {
    console.log('cancelOrder', orderId);
    await cancelOrder({
      orderId,
      acknowledgedCosts,
      cancellation,
      comment,
      meta: { version: getAppVersion() },
    });
  }

  observeCancellation(orderId: string, resultHandler: (payment: OrderCancellation | null) => void) {
    cancellationRef(orderId).onSnapshot(
      (snapshot) => {
        if (snapshot.exists) resultHandler(snapshot.data() as OrderCancellation);
        else resultHandler(null);
      },
      (error) => {
        console.error(error);
        crashlytics().recordError(error);
      }
    );
  }
}
