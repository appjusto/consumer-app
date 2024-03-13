import { Order } from '@appjusto/types';
import { getOrderItemsTotal } from './getOrderItemsTotal';

export const isOrderEmpty = (order: Order | undefined | null) => {
  // console.log('isOrderEmpty', typeof order);
  if (order === null) return true;
  if (order?.type === 'food') return getOrderItemsTotal(order) <= 0;
  return false;
};
