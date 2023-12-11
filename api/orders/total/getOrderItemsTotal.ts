import { Order } from '@appjusto/types';
import { getItemTotal } from '../items/getItemTotal';

export const getOrderItemsTotal = (order?: Order) =>
  (order?.items ?? []).reduce((sum, item) => sum + getItemTotal(item), 0);
