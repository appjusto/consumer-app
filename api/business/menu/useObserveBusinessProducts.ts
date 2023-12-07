import { useContextApi } from '@/api/ApiContext';
import { Product, WithId } from '@appjusto/types';
import React from 'react';

export const useObserveBusinessProducts = (businessId: string) => {
  // context
  const api = useContextApi();
  // state
  const [products, setProducts] = React.useState<WithId<Product>[]>();
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    return api.business().observeProducts(businessId, setProducts);
  }, [api, businessId]);
  // result
  return products;
};
