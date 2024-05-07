import { useContextApi } from '@/api/ApiContext';
import { Product, WithId } from '@appjusto/types';
import React from 'react';

export const useObserveBusinessProduct = (businessId?: string, productId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [product, setProduct] = React.useState<WithId<Product>>();
  // side effects
  React.useEffect(() => {
    if (!businessId || !productId) {
      setProduct(undefined);
      return;
    }
    return api.business().observeProduct(businessId, productId, setProduct);
  }, [api, businessId, productId]);
  // result
  return product;
};
