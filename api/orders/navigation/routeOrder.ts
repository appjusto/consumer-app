import { OrderStatus, OrderType, PayableWith } from '@appjusto/types';
import { router } from 'expo-router';
import { isOrderBeforeConfirmed, isOrderOngoing } from '../status';

export const routeOrder = (
  orderId: string,
  status: OrderStatus,
  type?: OrderType,
  paymentMethod?: PayableWith
) => {
  if (status === 'quote') {
    router.navigate({
      pathname: '/(logged)/checkout/[orderId]/',
      params: { orderId },
    });
  } else if (isOrderBeforeConfirmed(status)) {
    if (paymentMethod === 'pix') {
      router.navigate({
        pathname: '/(logged)/(tabs)/order/[orderId]/confirming-pix',
        params: { orderId },
      });
    } else {
      router.navigate({
        pathname: '/(logged)/(tabs)/order/[orderId]/confirming',
        params: { orderId },
      });
    }
  } else if (status === 'confirmed') {
    if (type === 'food') {
      router.navigate({
        pathname: '/(logged)/(tabs)/order/[orderId]/confirming',
        params: { orderId },
      });
    } else {
      router.navigate({
        pathname: '/(logged)/(tabs)/order/[orderId]/ongoing',
        params: { orderId },
      });
    }
  } else if (isOrderOngoing(status)) {
    router.navigate({
      pathname: '/(logged)/(tabs)/order/[orderId]/ongoing',
      params: { orderId },
    });
  } else {
    router.navigate({
      pathname: '/(logged)/(tabs)/order/[orderId]/completed',
      params: { orderId },
    });
  }
};
