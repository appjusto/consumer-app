import { useContextApi } from '@/api/ApiContext';
import { GetTicketBalanceResult } from '@appjusto/types';
import { useEffect, useState } from 'react';

export const useTicketBalance = () => {
  // context
  const api = useContextApi();
  // state
  const [balance, setBalance] = useState<GetTicketBalanceResult>();
  // side effects
  useEffect(() => {
    api.consumers().fetchTicketBalance().then(setBalance);
  }, [api]);
  // result
  return balance;
};
