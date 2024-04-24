import { Order, WithId } from '@appjusto/types';
import { usePathname } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useContextApi } from '../ApiContext';
import { ObserveOrdersOptions } from './types';

export const useObservePackageQuote = () => {
  // context
  const api = useContextApi();
  const pathname = usePathname();
  const enabled = pathname.startsWith('/encomendas');
  // refs
  const optionsRef = useRef<ObserveOrdersOptions>({
    statuses: ['quote', 'declined'],
    type: 'p2p',
    limit: 1,
  });
  const options = optionsRef.current;
  // state
  const [orders, setOrders] = useState<WithId<Order>[]>();
  const [orderQuote, setOrderQuote] = useState<WithId<Order> | null>();
  // side effects
  useEffect(() => {
    setOrders(undefined);
    if (!enabled) return;
    return api.orders().observeOrders(options, setOrders);
  }, [api, options, enabled]);
  useEffect(() => {
    if (!orders) setOrderQuote(undefined);
    else if (orders.length === 0) setOrderQuote(null);
    else setOrderQuote(orders[0]);
  }, [orders]);
  // result
  return orderQuote;
};
