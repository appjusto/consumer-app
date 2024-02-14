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
  const [loading, setLoading] = useState(false);
  // helpers
  const orderId = order?.id;
  const created = order?.status === 'quote' && Boolean(order?.timestamps?.quote);
  const distance = order?.route?.distance;
  const fulfillment = order?.fulfillment;
  // side effects
  // console.log('order', orderId);
  useEffect(() => {
    if (!orderId) return;
    if (!created) return;
    if (!distance) return;
    if (defaultPaymentMethod === undefined) return;
    // setFares(undefined);
    console.log('useOrderFares', orderId, created, distance, fulfillment, defaultPaymentMethod);
    setLoading(true);
    api
      .orders()
      .getOrderQuotes(orderId, defaultPaymentMethod ?? 'pix')
      .then((fares) => {
        setFares(fares);
        api
          .orders()
          .updateOrder(orderId, { fare: fares[0] })
          .catch(() => {
            console.error('Erro ao atualizar fare');
          });
      })
      .catch((error) => {
        if (error instanceof Error) showToast(error.message, 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [api, orderId, created, distance, showToast, fulfillment, defaultPaymentMethod]);
  // result
  return { fares, loading };
};
