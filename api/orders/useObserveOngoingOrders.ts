import { Order, OrderType, WithId } from '@appjusto/types';
import { useEffect, useRef, useState } from 'react';
import { useContextApi } from '../ApiContext';
import { OngoingOrdersStatuses } from './status';
import { ObserveOrdersOptions } from './types';

export const useObserveOngoingOrders = (type: OrderType) => {
  // context
  const api = useContextApi();
  // refs
  const optionsRef = useRef<ObserveOrdersOptions>({ statuses: OngoingOrdersStatuses });
  const options = optionsRef.current;
  // state
  const [orders, setOrders] = useState<WithId<Order>[]>();
  useEffect(() => {
    if (!type) return;
    return api.orders().observeOrders({ ...options, type }, setOrders);
  }, [api, options, type]);
  // result
  return orders;
};
