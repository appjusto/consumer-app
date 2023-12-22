import { useObserveBusiness } from '@/api/business/useObserveBusiness';
import { fromDate } from '@/api/firebase/timestamp';
import { Dayjs } from '@appjusto/dates';
import { Order } from '@appjusto/types';
import { Timestamp } from '@appjusto/types/external/firebase';
import { useEffect, useState } from 'react';

export const useOrderDeliveryEstimate = (order: Order) => {
  const { fulfillment, scheduledTo } = order;
  const delivery = fulfillment === 'delivery';
  const preparing = order.timestamps.preparing;
  const destinationEstimate = order.arrivals?.destination?.estimate;
  // state
  const business = useObserveBusiness(order.business?.id);
  const businessAverageCookingTime = business?.averageCookingTime;
  const [estimate, setEstimate] = useState<Timestamp>();
  // side effects
  useEffect(() => {
    if (estimate) return;
    if (scheduledTo) {
      setEstimate(scheduledTo);
    } else if (delivery) {
      if (destinationEstimate) setEstimate(destinationEstimate);
    } else if (businessAverageCookingTime && preparing) {
      setEstimate(
        fromDate(Dayjs(preparing.toDate()).add(businessAverageCookingTime, 'second').toDate())
      );
    }
  }, [delivery, estimate, destinationEstimate, businessAverageCookingTime, preparing, scheduledTo]);
  // results
  return estimate;
};
