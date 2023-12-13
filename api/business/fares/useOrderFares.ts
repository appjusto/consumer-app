import { useContextApi } from '@/api/ApiContext';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { Fare, Order, WithId } from '@appjusto/types';
import { useEffect, useState } from 'react';

export const useOrderFares = (order: WithId<Order> | null | undefined) => {
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  // state
  const [fares, setFares] = useState<Fare[]>();
  // helpers
  const id = order?.id;
  // TODO: get last used that can be used now
  const paymentMethod = order?.paymentMethod ?? 'credit_card';
  const fulfillment = order?.fulfillment;
  const destinationAddress = order?.destination?.address.description;
  // side effects
  useEffect(() => {
    if (!id) return;
    api
      .orders()
      .getOrderQuotes(id, paymentMethod)
      .then((fares) => {
        setFares(fares);
        if (fares.length) api.orders().updateOrder(id, { fare: fares[0] });
      })
      .catch((error) => {
        if (error instanceof Error) showToast(error.message, 'error');
      });
  }, [api, id, showToast, fulfillment, paymentMethod, destinationAddress]);
  // result
  console.log('results', fares);
  return fares;
};
