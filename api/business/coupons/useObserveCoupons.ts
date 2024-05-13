import { useContextApi } from '@/api/ApiContext';
import { Coupon, WithId } from '@appjusto/types';
import React from 'react';

export const useObserveCoupons = (businessId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [coupons, setCoupons] = React.useState<WithId<Coupon>[]>();
  // side effects
  React.useEffect(() => {
    if (!businessId) {
      setCoupons(undefined);
      return;
    }
    return api.business().observeCoupons(businessId, setCoupons);
  }, [api, businessId]);
  // result
  return coupons;
};
