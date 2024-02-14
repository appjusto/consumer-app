import { Order, WithId } from '@appjusto/types';
import { useEffect, useRef, useState } from 'react';
import { useContextApi } from '../ApiContext';
import { ObserveOrdersOptions } from './types';

export const useObservePackageQuote = (enabled = true) => {
  // context
  const api = useContextApi();
  // refs
  const optionsRef = useRef<ObserveOrdersOptions>({ statuses: ['quote'], type: 'p2p', limit: 1 });
  const options = optionsRef.current;
  // state
  const [orders, setOrders] = useState<WithId<Order>[]>();
  const [orderQuote, setOrderQuote] = useState<WithId<Order> | null>();
  // side effects
  useEffect(() => {
    if (!enabled) return;
    return api.orders().observeOrders(options, setOrders);
  }, [api, options, enabled]);
  useEffect(() => {
    if (!orders) return;
    if (orders.length === 0) setOrderQuote(null);
    else setOrderQuote(orders[0]);
  }, [orders]);
  // result
  return orderQuote;
};
