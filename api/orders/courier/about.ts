import { FullDate, formatTimestamp } from '@/common/formatters/timestamp';
import { Order } from '@appjusto/types';

export const aboutCourier = (order: Order) => {
  if (order.courier?.about) {
    return order.courier.about;
  }
  if (order.courier?.joined) {
    return `Na rede appjusto desde ${formatTimestamp(order.courier.joined, FullDate)}`;
  }
  return '';
};
