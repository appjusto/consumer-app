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

export const AllOrdersStatuses: OrderStatus[] = OngoingOrdersStatuses.concat([
  'canceled',
  'declined',
  'delivered',
]);

export const FailedOrdersStatuses: OrderStatus[] = ['canceled', 'rejected', 'declined'];

export const isOrderOngoing = (status: OrderStatus) => OngoingOrdersStatuses.includes(status);

type OrderStage = 'quote' | 'placing' | 'ongoing' | 'expired' | 'canceled' | 'delivered';
export const getOrderStage = (status: OrderStatus, type: OrderType): OrderStage => {
  if (status === 'quote') return 'quote';
  if (status === 'expired') return 'expired';
  if (status === 'confirming') return 'placing';
  if (status === 'charged') return 'placing';
  if (status === 'confirmed') {
    if (type === 'food') return 'placing';
    return 'ongoing';
  }
  if (isOrderOngoing(status)) return 'ongoing';
  if (FailedOrdersStatuses.includes(status)) return 'canceled';
  return 'delivered';
};
