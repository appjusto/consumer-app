import { LedgerEntry, WithId } from '@appjusto/types';
import { useEffect, useState } from 'react';
import { useContextApi } from '../ApiContext';

export const useObserveEntries = () => {
  // context
  const api = useContextApi();
  // state
  const [entries, setEntries] = useState<WithId<LedgerEntry>[]>();
  // side effects
  useEffect(() => {
    return api.ledger().observeLedger({}, setEntries);
  }, [api]);
  // result
  return entries;
};
