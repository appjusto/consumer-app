import { useContextApi } from '@/api/ApiContext';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { Fare, Order, PayableWith, WithId } from '@appjusto/types';
import { useEffect, useState } from 'react';

export const useOrderFares = (
  order: WithId<Order> | null | undefined,
  defaultPaymentMethod: PayableWith | null | undefined,
  fleetsIds: string[] | undefined,
  findersFee: number,
  enabled = false
) => {
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  // state
  const [fares, setFares] = useState<Fare[]>();
  const [loading, setLoading] = useState(false);
  // helpers
  const orderId = order?.id;
  const distance = order?.fulfillment === 'delivery' ? order?.route?.distance : 0;
  const fulfillment = order?.fulfillment;
  const coupon = order?.coupon?.code;
  const numberOfItems = (order?.items ?? []).reduce((r, i) => r + i.quantity, 0);
  // side effects
  // console.log('useOrderFares', orderId, distance, defaultPaymentMethod, enabled);
  useEffect(() => {
    if (!orderId) return;
    if (distance === undefined) return;
    if (defaultPaymentMethod === undefined) return;
    // if (fulfillment === 'delivery' && !fleetsIds) return;
    if (!enabled) return;
    // setFares(undefined);
    // console.log(
    //   'useOrderFares -> update',
    //   orderId,
    //   distance,
    //   fulfillment,
    //   defaultPaymentMethod,
    //   fleetsIds
    // );
    setLoading(true);
    api
      .orders()
      .getOrderQuotes(orderId, defaultPaymentMethod ?? 'pix', findersFee, fleetsIds)
      .then((fares) => {
        setFares(fares);
        const fare = fares[0];
        if (fare) {
          api
            .orders()
            .updateOrder(orderId, { fare })
            .catch(() => {
              console.error('Erro ao atualizar fare');
            });
        }
      })
      .catch((error) => {
        if (error instanceof Error) showToast(error.message, 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    api,
    showToast,
    orderId,
    distance,
    fulfillment,
    defaultPaymentMethod,
    fleetsIds,
    coupon,
    numberOfItems,
    findersFee,
    enabled,
  ]);
  // result
  return { fares, loading };
};
