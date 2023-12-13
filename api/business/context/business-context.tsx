import { useObserveBusinessQuote } from '@/api/orders/useObserveBusinessQuote';
import { Category, Fare, Order, Product, PublicBusiness, WithId } from '@appjusto/types';
import { memoize } from 'lodash';
import React, { useMemo } from 'react';
import { useOrderFares } from '../fares/useOrderFares';
import { useObserveBusinessMenu } from '../menu/useObserveBusinessMenu';
import { useObserveBusiness } from '../useObserveBusiness';

const BusinessContext = React.createContext<Value>({});

interface Props {
  businessId: string;
  children: React.ReactNode;
}

interface Value {
  quote?: WithId<Order> | null;
  fares?: Fare[] | undefined;
  business?: WithId<PublicBusiness> | null;
  products?: (string | WithId<Product>)[];
  getProduct?: (produtId: string) => WithId<Product> | undefined;
  getProductCategory?: (produtId: string) => WithId<Category> | undefined;
}

export const BusinessProvider = ({ businessId, children }: Props) => {
  // state
  const business = useObserveBusiness(businessId);
  const quote = useObserveBusinessQuote(businessId);
  const fares = useOrderFares(quote);
  const { categoriesWithProducts, loaded, groupsWithComplements, getProductCategory } =
    useObserveBusinessMenu(businessId);
  const products = useMemo(
    () =>
      loaded
        ? categoriesWithProducts.reduce(
            (r, category) => [...r, category.name, ...category.items],
            [] as (string | WithId<Product>)[]
          )
        : undefined,
    [loaded, categoriesWithProducts]
  );
  const getProduct = memoize((productId: string) => {
    const product = products?.find((value) => typeof value === 'object' && value.id === productId);
    if (typeof product !== 'object') return undefined;
    if (!product.complementsEnabled) return product;
    if (!product.complementsGroupsIds) return product;
    return {
      ...product,
      complementsGroups: groupsWithComplements.filter(
        ({ id }) => product.complementsGroupsIds?.includes(id)
      ),
    } as WithId<Product>;
  });
  // result
  return (
    <BusinessContext.Provider
      value={{ quote, fares, business, products, getProduct, getProductCategory }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useContextBusiness = () => {
  const value = React.useContext(BusinessContext);
  if (!value) throw new Error('Api fora de contexto.');
  return value.business;
};

export const useContextBusinessQuote = () => {
  const value = React.useContext(BusinessContext);
  if (!value) throw new Error('Api fora de contexto.');
  return value.quote;
};

export const useContextBusinessQuoteFares = () => {
  const value = React.useContext(BusinessContext);
  if (!value) throw new Error('Api fora de contexto.');
  return value.fares;
};

export const useContextBusinessProducts = () => {
  const value = React.useContext(BusinessContext);
  if (!value) throw new Error('Api fora de contexto.');
  return value.products;
};

export const useContextBusinessProduct = (productId: string) => {
  const value = React.useContext(BusinessContext);
  if (!value?.getProduct) throw new Error('Api fora de contexto.');
  return value.getProduct(productId);
};

export const useContextBusinessProductCategory = (productId: string) => {
  const value = React.useContext(BusinessContext);
  if (!value?.getProductCategory) throw new Error('Api fora de contexto.');
  return value.getProductCategory(productId);
};
