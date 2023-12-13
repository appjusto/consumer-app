import { useContextApi } from '@/api/ApiContext';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { Fare, Order, PayableWith, WithId } from '@appjusto/types';
import { useEffect, useState } from 'react';

export const useOrderFares = (
  order: WithId<Order> | null | undefined,
  defaultPaymentMethod: PayableWith | null | undefined
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
    console.log('useOrderFares', defaultPaymentMethod);
    if (!id) return;
    if (defaultPaymentMethod === undefined) return;
    api
      .orders()
      .getOrderQuotes(id, defaultPaymentMethod ?? 'pix')
      .then((fares) => {
        setFares(fares);
        if (fares.length) api.orders().updateOrder(id, { fare: fares[0] });
      })
      .catch((error) => {
        if (error instanceof Error) showToast(error.message, 'error');
      });
  }, [api, id, showToast, fulfillment, defaultPaymentMethod, destinationAddress]);
  // result
  console.log('results', fares);
  return fares;
};
