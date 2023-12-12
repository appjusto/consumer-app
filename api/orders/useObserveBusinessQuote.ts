import { Order, WithId } from '@appjusto/types';
import { useEffect, useRef, useState } from 'react';
import { useContextApi } from '../ApiContext';
import { ObserveOrdersOptions } from './OrdersApi';

export const useObserveBusinessQuote = (businessId: string) => {
  // context
  const api = useContextApi();
  // refs
  const optionsRef = useRef<ObserveOrdersOptions>({ statuses: ['quote'], businessId, limit: 1 });
  const options = optionsRef.current;
  // state
  const [orders, setOrders] = useState<WithId<Order>[]>();
  const [orderQuote, setOrderQuote] = useState<WithId<Order> | null>();
  // side effects
  useEffect(() => {
    return api.orders().observeOrders(options, setOrders);
  }, [api, businessId, options]);
  useEffect(() => {
    if (!orders) return;
    if (orders.length === 0) setOrderQuote(null);
    else if (orders[0].items?.length === 0) setOrderQuote(null);
    else setOrderQuote(orders[0]);
  }, [orders]);
  // result
  return orderQuote;
};
