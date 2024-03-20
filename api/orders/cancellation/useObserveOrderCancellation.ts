import { OrderCancellation } from '@appjusto/types';
import { useEffect, useState } from 'react';
import { useContextApi } from '../../ApiContext';

export const useObserveOrderCancellation = (orderId?: string, enabled = true) => {
  // context
  const api = useContextApi();
  // state
  const [cancellation, setCancellation] = useState<OrderCancellation | null>();
  // side effects
  useEffect(() => {
    if (!orderId) return;
    if (!enabled) return;
    return api.orders().observeCancellation(orderId, setCancellation);
  }, [api, orderId, enabled]);
  // result
  console.log('useObserveOrderCancellation', orderId, enabled, cancellation);
  return cancellation;
};
