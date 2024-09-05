import { useContextApi } from '@/api/ApiContext';
import { GetTicketBalanceResult } from '@appjusto/types';
import { useEffect, useRef, useState } from 'react';

export const useTicketBalance = (nonce: string) => {
  // context
  const api = useContextApi();
  // refs
  const loading = useRef(false);
  // state
  const [balance, setBalance] = useState<GetTicketBalanceResult>();
  // side effects
  useEffect(() => {
    console.log('useTicketBalance', loading.current);
    if (loading.current) return;
    loading.current = true;
    api
      .consumers()
      .fetchTicketBalance()
      .then((value) => {
        console.log('useTicketBalance', value);
        setBalance(value);
        loading.current = false;
      });
  }, [api, nonce]);
  // result
  return balance;
};
