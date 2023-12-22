import { PublicBusiness, WithId } from '@appjusto/types';
import React from 'react';
import { useContextApi } from '../ApiContext';

export const useObserveBusiness = (businessId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [business, setBusiness] = React.useState<WithId<PublicBusiness> | null>();
  // side effects
  // observe fleet
  React.useEffect(() => {
    if (!businessId) return;
    return api.business().observeBusiness(businessId, setBusiness);
  }, [api, businessId]);
  // result
  return business;
};
