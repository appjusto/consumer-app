import { useContextApi } from '@/api/ApiContext';
import { Category, WithId } from '@appjusto/types';
import React from 'react';

export const useObserveBusinessCategories = (businessId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [categories, setCategories] = React.useState<WithId<Category>[]>();
  // side effects
  React.useEffect(() => {
    if (!businessId) {
      setCategories(undefined);
      return;
    }
    // console.log('useObserveBusinessCategories', businessId);
    return api.business().observeCategories(businessId, setCategories);
  }, [api, businessId]);
  // result
  return categories;
};
