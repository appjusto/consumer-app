import { useContextApi } from '@/api/ApiContext';
import { GetCancellationInfoResult } from '@appjusto/types';
import React, { useEffect } from 'react';
import { useContextOrder } from '../context/order-context';

export const useGetCancellationInfo = (enabled: boolean) => {
  // context
  const api = useContextApi();
  const order = useContextOrder();
  const orderId = order?.id;
  // state
  const [cancellationInfo, setCancellationInfo] = React.useState<GetCancellationInfoResult>();
  // side effects
  useEffect(() => {
    if (!enabled) return;
    if (!orderId) return;
    api.orders().getCancellationInfo(orderId).then(setCancellationInfo);
  }, [api, enabled, orderId]);
  // result
  return cancellationInfo;
};
