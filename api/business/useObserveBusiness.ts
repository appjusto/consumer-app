import { PublicBusiness, WithId } from '@appjusto/types';
import React from 'react';
import { useContextApi } from '../ApiContext';
import { useObserveBusinessByCode } from './useObserveBusinessByCode';

export const useObserveBusiness = (businessId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [business, setBusiness] = React.useState<WithId<PublicBusiness> | null>();
  const businessByCode = useObserveBusinessByCode(businessId, business === null);
  // side effects
  // observe fleet
  React.useEffect(() => {
    setBusiness(undefined);
    if (!businessId) return;
    return api.business().observeBusiness(businessId, setBusiness);
  }, [api, businessId]);
  // logs
  // console.log('business === null', business === null);
  // result
  return business ?? businessByCode;
};
