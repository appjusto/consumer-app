import { Order, WithId } from '@appjusto/types';
import { useEffect, useState } from 'react';
import { useContextApi } from '../ApiContext';

export const useObserveOrder = (orderId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [order, setOrder] = useState<WithId<Order> | null>();
  // side effects
  useEffect(() => {
    setOrder(undefined);
    if (!orderId) return;
    return api.orders().observeOrder(orderId, setOrder);
  }, [api, orderId]);
  // result
  return order;
};
