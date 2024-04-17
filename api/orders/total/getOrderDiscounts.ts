import { Order } from '@appjusto/types';

export const getOrderDiscounts = (order: Order) => {
  let value = order?.fare?.credits ?? 0;
  value -= order?.fare?.discount ?? 0;
  return value;
};
