import { Order } from '@appjusto/types';
import { getOrderItemsTotal } from '../total/getOrderItemsTotal';
import { getOrderDeliveryCost } from './getOrderDeliveryCost';

export const getOrderTotalCost = (order: Order) => {
  let value = getOrderItemsTotal(order);
  value += getOrderDeliveryCost(order);
  return value;
};
