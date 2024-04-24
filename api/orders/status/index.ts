import { OrderStatus } from '@appjusto/types';

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

export const BeforeConfirmedOrderStatuses: OrderStatus[] = ['quote', 'confirming', 'charged'];
export const FailedOrdersStatuses: OrderStatus[] = ['canceled', 'rejected', 'declined'];

export const isOrderOngoing = (status: OrderStatus) => OngoingOrdersStatuses.includes(status);
export const isOrderBeforeConfirmed = (status: OrderStatus) =>
  BeforeConfirmedOrderStatuses.includes(status);
export const hasOrderFailed = (status: OrderStatus) => FailedOrdersStatuses.includes(status);
