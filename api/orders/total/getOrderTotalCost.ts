import { Order } from '@appjusto/types';
import { getOrderDeliveryCost } from './getOrderDeliveryCost';
import { getOrderItemsTotal } from './getOrderItemsTotal';

export const getOrderTotalCost = (order: Order) => {
  let value = getOrderItemsTotal(order);
  value += getOrderDeliveryCost(order);
  value -= order?.fare?.credits ?? 0;
  return value;
};
