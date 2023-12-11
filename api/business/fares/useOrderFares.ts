import { useContextApi } from '@/api/ApiContext';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { Fare, Order, PayableWith, WithId } from '@appjusto/types';
import { useEffect, useState } from 'react';

export const useOrderFares = (
  order: WithId<Order> | null | undefined,
  paymentMethod: PayableWith
) => {
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  // state
  const [fares, setFares] = useState<Fare[]>();
  // helpers
  const id = order?.id;
  const fulfillment = order?.fulfillment;
  const destinationAddress = order?.destination?.address.description;
  // side effects
  useEffect(() => {
    if (!id) return;
    api
      .orders()
      .getOrderQuotes(id, paymentMethod)
      .then(setFares)
      .catch((error) => {
        if (error instanceof Error) showToast(error.message, 'error');
      });
  }, [api, id, fulfillment, showToast, paymentMethod, destinationAddress]);
  // result
  return fares;
};
