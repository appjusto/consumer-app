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
  const created = Boolean(order?.timestamps?.quote);
  const id = order?.id;
  const fare = order?.fare;
  const fulfillment = order?.fulfillment;
  const destinationAddress = order?.destination?.address.description;
  const routeDistance = order?.route?.distance;
  // side effects
  useEffect(() => {
    console.log('useOrderFares', defaultPaymentMethod);
    if (!id) return;
    if (defaultPaymentMethod === undefined) return;
    if (!routeDistance) return;
    api
      .orders()
      .getOrderQuotes(id, defaultPaymentMethod ?? 'pix')
      .then((fares) => {
        setFares(fares);
      })
      .catch((error) => {
        if (error instanceof Error) showToast(error.message, 'error');
      });
  }, [api, id, showToast, fulfillment, defaultPaymentMethod, destinationAddress, routeDistance]);
  // result
  // console.log('results', fares);
  useEffect(() => {
    if (!created) return;
    if (!id) return;
    if (!fares?.length) return;
    if (fare) return;
    api
      .orders()
      .updateOrder(id, { fare: fares[0] })
      .catch(() => {
        console.error('Erro ao atualizar fare');
      });
  }, [created, id, fares, fare, api]);
  return fares;
};
