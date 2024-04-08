import { Payment, WithId } from '@appjusto/types';
import { useEffect, useState } from 'react';
import { useContextApi } from '../../ApiContext';

export const useObservePendingPayment = (orderId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [payment, setPayment] = useState<WithId<Payment> | null>();
  // side effects
  useEffect(() => {
    if (!orderId) return;
    return api.payments().observePendingPayment(orderId, setPayment);
  }, [api, orderId]);
  // result
  return payment;
};
