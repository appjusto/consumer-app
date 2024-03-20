import { OrderStatus, OrderType } from '@appjusto/types';
import { getOrderStage } from '../status';

export const getOrderPath = (
  status: OrderStatus,
  type: OrderType,
  from?: 'confirming' | 'ongoing'
) => {
  const stage = getOrderStage(status, type);
  if (stage === 'placing') {
    if (from !== 'confirming') return '/(logged)/(tabs)/(orders)/[orderId]/confirming';
  } else if (stage === 'ongoing') {
    if (from !== 'ongoing') return '/(logged)/(tabs)/(orders)/[orderId]/ongoing';
  } else if (stage === 'delivered') {
    if (from === 'confirming') return '/(logged)/(tabs)/(orders)/[orderId]/delivered';
    else return '/(logged)/(tabs)/(orders)/[orderId]/completed';
  } else if (stage === 'canceled') {
    return '/(logged)/(tabs)/(orders)/[orderId]/completed';
  }
  return null;
};
