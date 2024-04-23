import { PublicBusiness, WithId } from '@appjusto/types';
import React from 'react';
import { useContextApi } from '../ApiContext';

export const useObserveBusinessByCode = (code?: string, enabled?: boolean) => {
  // context
  const api = useContextApi();
  // state
  const [business, setBusiness] = React.useState<WithId<PublicBusiness> | null>();
  // side effects
  // observe fleet
  React.useEffect(() => {
    setBusiness(undefined);
    if (!enabled) return;
    if (!code) return;
    return api.business().observeBusinessBySlug(code, setBusiness);
  }, [api, code, enabled]);
  // result
  return business;
};
