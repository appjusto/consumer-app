import { useContextApi } from '@/api/ApiContext';
import { Ordering } from '@appjusto/types';
import React from 'react';

export const useObserveBusinessMenuOrder = (businessId?: string, menuId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [ordering, setOrdering] = React.useState<Ordering>();
  // side effects
  React.useEffect(() => {
    if (!businessId) {
      setOrdering(undefined);
      return;
    }
    // console.log('useObserveBusinessMenuOrder', businessId, menuId);
    return api.business().observeMenuOrder(businessId, setOrdering, menuId);
  }, [api, businessId, menuId]);
  // result
  return ordering;
};
