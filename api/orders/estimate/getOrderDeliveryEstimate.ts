import { fromDate } from '@/api/firebase/timestamp';
import { Dayjs } from '@appjusto/dates';
import { Business, Order } from '@appjusto/types';

export const getOrderDeliveryEstimate = (order: Order, business?: Business) => {
  const { fulfillment } = order;
  const delivery = fulfillment === 'delivery';
  const destinationEstimateAt = order.arrivals?.destination?.estimate;
  // use estimate when it exists
  if (delivery && destinationEstimateAt) {
    return destinationEstimateAt;
  }
  // calculate according averageCookingTime when doesn't
  const preparingAt = order.timestamps.preparing;
  const businessAverageCookingTime = business?.averageCookingTime;
  if (businessAverageCookingTime && preparingAt) {
    return fromDate(Dayjs(preparingAt.toDate()).add(businessAverageCookingTime, 'second').toDate());
  }
  // loading business
  if (order.business?.id && !business) return undefined;
  // shouldn't happen
  return null;
};
