import { OrderStatus, OrderType } from '@appjusto/types';

export const OngoingOrdersStatuses: OrderStatus[] = [
  'scheduled',
  'confirming',
  'charged',
  'confirmed',
  'preparing',
  'ready',
  'dispatching',
];

export const FailedOrdersStatuses: OrderStatus[] = ['expired'];

export const isOrderOngoing = (status: OrderStatus) => OngoingOrdersStatuses.includes(status);

type OrderStage = 'quote' | 'confirming' | 'ongoing' | 'expired' | 'completed';
export const getOrderStage = (status: OrderStatus, type: OrderType): OrderStage => {
  if (status === 'quote') return 'quote';
  if (status === 'expired') return 'expired';
  if (status === 'confirming') return 'confirming';
  if (status === 'charged') return 'confirming';
  if (status === 'confirmed') {
    if (type === 'food') return 'confirming';
    return 'ongoing';
  }
  if (isOrderOngoing(status)) return 'ongoing';
  return 'completed';
};
