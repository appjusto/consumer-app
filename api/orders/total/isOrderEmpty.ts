import { Order } from '@appjusto/types';

export const isOrderEmpty = (order: Order | undefined | null) => {
  // console.log('isOrderEmpty', typeof order);
  if (order === null) return true;
  if (order?.type === 'food') return order.items?.length === 0;
  return false;
};
