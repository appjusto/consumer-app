import { Order } from '@appjusto/types';
import { getItemTotal } from '../items/getItemTotal';

// export const getOrderItemsTotal = (order?: Order) =>
//   (order?.items ?? []).reduce((sum, item) => sum + getItemTotal(item), 0);

export const getOrderItemsTotal = (order?: Order, applyDiscount = false) => {
  let total = 0;
  if (applyDiscount && order?.coupon?.type === 'food-discount' && order.coupon.discount) {
    total = order.coupon.discount * -1;
  }
  total = (order?.items ?? []).reduce((sum, item) => sum + getItemTotal(item), total);
  return Math.max(0, total);
};
