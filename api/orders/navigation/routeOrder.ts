import { OrderStatus, OrderType, PayableWith } from '@appjusto/types';
import { router } from 'expo-router';
import { isOrderBeforeConfirmed, isOrderOngoing } from '../status';

export const routeOrder = (
  orderId: string,
  status: OrderStatus,
  type?: OrderType,
  paymentMethod?: PayableWith
) => {
  if (isOrderBeforeConfirmed(status)) {
    if (paymentMethod === 'pix') {
      router.navigate({
        pathname: '/(logged)/(tabs)/pedido/[orderId]/confirming-pix',
        params: { orderId },
      });
    } else {
      router.navigate({
        pathname: '/(logged)/(tabs)/pedido/[orderId]/confirming',
        params: { orderId },
      });
    }
  } else if (status === 'confirmed') {
    if (type === 'food') {
      router.navigate({
        pathname: '/(logged)/(tabs)/pedido/[orderId]/confirming',
        params: { orderId },
      });
    } else {
      router.navigate({
        pathname: '/(logged)/(tabs)/pedido/[orderId]/ongoing',
        params: { orderId },
      });
    }
  } else if (isOrderOngoing(status)) {
    router.navigate({
      pathname: '/(logged)/(tabs)/pedido/[orderId]/ongoing',
      params: { orderId },
    });
  } else {
    router.navigate({
      pathname: '/(logged)/(tabs)/pedido/[orderId]/completed',
      params: { orderId },
    });
  }
};
