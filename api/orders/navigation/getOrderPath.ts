import { OrderStatus, OrderType, PayableWith } from '@appjusto/types';
import { getOrderStage } from '../status';

export type FromScreen = 'confirming' | 'confirming-pix' | 'ongoing';

export const getOrderPath = (
  status: OrderStatus,
  type: OrderType,
  paymentMethod?: PayableWith,
  from?: FromScreen
) => {
  const stage = getOrderStage(status, type);
  if (stage === 'placing') {
    if (from === 'confirming-pix') {
      if (status === 'confirmed') return '/(logged)/(tabs)/pedido/[orderId]/confirming';
    } else {
      if (from !== 'confirming') {
        if (paymentMethod === 'pix') return '/(logged)/(tabs)/pedido/[orderId]/confirming-pix';
        return '/(logged)/(tabs)/pedido/[orderId]/confirming';
      }
    }
  } else if (stage === 'ongoing') {
    if (from !== 'ongoing') return '/(logged)/(tabs)/pedido/[orderId]/ongoing';
  } else if (stage === 'delivered') {
    if (from === 'ongoing') return '/(logged)/(tabs)/pedido/[orderId]/delivered';
    else return '/(logged)/(tabs)/pedido/[orderId]/completed';
  } else if (stage === 'canceled') {
    return '/(logged)/(tabs)/pedido/[orderId]/completed';
  }
  return null;
};
