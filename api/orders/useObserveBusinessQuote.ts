import { Order, WithId } from '@appjusto/types';
import { useEffect, useRef, useState } from 'react';
import { useContextApi } from '../ApiContext';
import { ObserveOrdersOptions } from './types';

export const useObserveBusinessQuote = (businessId?: string, enabled = true) => {
  // context
  const api = useContextApi();
  // refs
  const optionsRef = useRef<ObserveOrdersOptions>({ statuses: ['quote'], limit: 1 });
  const options = optionsRef.current;
  // state
  const [orders, setOrders] = useState<WithId<Order>[]>();
  const [orderQuote, setOrderQuote] = useState<WithId<Order> | null>();
  // side effects
  useEffect(() => {
    setOrders(undefined);
    if (!enabled) return;
    if (!businessId) return;
    return api.orders().observeOrders({ ...options, businessId }, setOrders);
  }, [api, options, enabled, businessId]);
  useEffect(() => {
    if (!orders) setOrderQuote(undefined);
    else if (orders.length === 0) setOrderQuote(null);
    else setOrderQuote(orders[0]);
  }, [orders]);
  // result
  return orderQuote;
};
