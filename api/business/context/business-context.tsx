import { Category, Product, PublicBusiness, WithId } from '@appjusto/types';
import { useGlobalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useObserveBusinessMenu } from '../menu/useObserveBusinessMenu';
import { useObserveBusiness } from '../useObserveBusiness';

const BusinessContext = React.createContext<Value>({});

interface Props {
  businessId?: string;
  children: React.ReactNode;
}

interface Value {
  business?: WithId<PublicBusiness> | null;
  products?: (string | WithId<Product>)[];
  categories?: string[];
  getProduct?: (produtId: string) => WithId<Product> | undefined;
  getProductCategory?: (produtId: string) => WithId<Category> | undefined;
  loaded?: boolean;
}

export const BusinessProvider = ({ children }: Props) => {
  // params
  const { businessId } = useGlobalSearchParams<{ businessId: string }>();
  // state
  const business = useObserveBusiness(businessId);
  const { categoriesWithProducts, loaded, groupsWithComplements, getProductCategory } =
    useObserveBusinessMenu(businessId);
  const [products, setProducts] = useState<(string | WithId<Product>)[]>();
  const [categories, setCategories] = useState<string[]>();
  // side effects
  useEffect(() => {
    setProducts(undefined);
    setCategories(undefined);
  }, [businessId]);
  useEffect(() => {
    if (!loaded) return;
    const categoryList: string[] = [];
    setProducts(
      categoriesWithProducts.reduce(
        (r, category) => {
          categoryList.push(category.name);
          return [...r, category.name, ...(category.items ?? [])];
        },
        [] as (string | WithId<Product>)[]
      )
    );
    setCategories(categoryList);
  }, [categoriesWithProducts, loaded]);
  const getProduct = (productId: string) => {
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
  };
  // logs
  // console.log('typeof products', typeof products);
  // result
  return (
    <BusinessContext.Provider
      value={{
        business,
        products,
        categories,
        getProduct,
        getProductCategory,
        loaded,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useContextBusiness = () => {
  const value = React.useContext(BusinessContext);
  if (!value) return null;
  return value.business;
};

export const useContextBusinessCategories = () => {
  const value = React.useContext(BusinessContext);
  if (!value) throw new Error('Api fora de contexto.');
  return value.categories;
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
