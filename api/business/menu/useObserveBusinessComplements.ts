import { useContextApi } from '@/api/ApiContext';
import { Complement, ComplementGroup, WithId } from '@appjusto/types';
import { useEffect, useState } from 'react';

interface Result {
  complementsGroups: WithId<ComplementGroup>[] | undefined;
  complements: WithId<Complement>[] | undefined;
}

export const useObserveBusinessComplements = (businessId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [complementsGroups, setComplementsGroups] = useState<WithId<ComplementGroup>[]>();
  const [complements, setComplements] = useState<WithId<Complement>[]>();
  const [result, setResult] = useState<Result>({
    complements: undefined,
    complementsGroups: undefined,
  });
  // side effects
  useEffect(() => {
    if (!businessId) {
      setComplementsGroups(undefined);
      return;
    }
    return api.business().observeComplementsGroups(businessId, setComplementsGroups);
  }, [api, businessId]);
  useEffect(() => {
    if (!businessId) {
      setComplements(undefined);
      return;
    }
    return api.business().observeComplements(businessId, setComplements);
  }, [api, businessId]);
  useEffect(() => {
    if (!complementsGroups || !complements) {
      setResult({
        complements: undefined,
        complementsGroups: undefined,
      });
      return;
    }
    setResult({ complementsGroups, complements });
  }, [complementsGroups, complements]);
  // result
  return result;
};
