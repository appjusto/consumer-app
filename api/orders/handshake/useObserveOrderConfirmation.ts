import { useContextApi } from '@/api/ApiContext';
import { OrderConfirmation } from '@appjusto/types';
import React from 'react';

export const useObserveOrderConfirmation = (orderId: string | undefined) => {
  // context
  const api = useContextApi();
  // app state
  const [confirmation, setConfirmation] = React.useState<OrderConfirmation>();
  // side effects
  // observe order confirmation
  React.useEffect(() => {
    if (!orderId) return;
    return api.orders().observeConfirmation(orderId, setConfirmation);
  }, [api, orderId]);
  // result
  return confirmation;
};
