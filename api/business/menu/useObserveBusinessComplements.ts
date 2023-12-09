import { useContextApi } from '@/api/ApiContext';
import { Complement, ComplementGroup, WithId } from '@appjusto/types';
import React from 'react';

export const useObserveBusinessComplements = (businessId: string) => {
  // context
  const api = useContextApi();
  // state
  const [complementsGroups, setComplementsGroups] = React.useState<WithId<ComplementGroup>[]>();
  const [complements, setComplements] = React.useState<WithId<Complement>[]>();
  // side effects
  React.useEffect(() => {
    return api.business().observeComplementsGroups(businessId, setComplementsGroups);
  }, [api, businessId]);
  React.useEffect(() => {
    return api.business().observeComplements(businessId, setComplements);
  }, [api, businessId]);
  // result
  return { complementsGroups, complements };
};
