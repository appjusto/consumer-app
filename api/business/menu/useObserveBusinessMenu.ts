import { getParent } from '@appjusto/menu';
import { Category, ComplementGroup, Ordering, WithId } from '@appjusto/types';
import { useEffect, useState } from 'react';
import { useObserveBusinessCategories } from './useObserveBusinessCategories';
import { useObserveBusinessComplements } from './useObserveBusinessComplements';
import { useObserveBusinessMenuOrder } from './useObserveBusinessMenuOrder';
import { useObserveBusinessProducts } from './useObserveBusinessProducts';

interface BusinessMenuResult {
  categoriesWithProducts: WithId<Category>[];
  groupsWithComplements: WithId<ComplementGroup>[];
  getProductCategory: (productId: string) => WithId<Category> | undefined;
  getComplementGroup: (complementId: string) => WithId<ComplementGroup> | undefined;
  loaded: boolean;
}

const InitialState: BusinessMenuResult = {
  categoriesWithProducts: [],
  groupsWithComplements: [],
  getProductCategory: (productId: string) => undefined,
  getComplementGroup: (complementId: string) => undefined,
  loaded: false,
};

export const useObserveBusinessMenu = (businessId?: string): BusinessMenuResult => {
  // state
  const categories = useObserveBusinessCategories(businessId);
  const products = useObserveBusinessProducts(businessId);
  const productsOrdering = useObserveBusinessMenuOrder(businessId);
  const { complementsGroups, complements } = useObserveBusinessComplements(businessId);
  const complementsOrdering = useObserveBusinessMenuOrder(businessId, 'complements');
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<WithId<Category>[]>();
  const [groupsWithComplements, setGroupsWithComplements] = useState<WithId<ComplementGroup>[]>();
  const [loaded, setLoaded] = useState(false);
  const [result, setResult] = useState<BusinessMenuResult>(InitialState);
  // side effects
  // inital state
  useEffect(() => {
    setLoaded(false);
    setResult(InitialState);
  }, [businessId]);
  // set categoriesWithProducts
  useEffect(() => {
    if (!categories) return;
    if (!products) return;
    if (!productsOrdering) return;
    // console.log(categories);
    // console.log(products);
    // console.log(productsOrdering);
    // console.log('setCategoriesWithProducts');
    setCategoriesWithProducts(getSorted2(categories, products, productsOrdering));
  }, [categories, products, productsOrdering]);
  // set groupsWithComplements
  useEffect(() => {
    if (!complementsGroups) return;
    if (!complements) return;
    if (!complementsOrdering) return;
    // console.log('setGroupsWithComplements');
    setGroupsWithComplements(getSorted2(complementsGroups, complements, complementsOrdering));
  }, [complementsGroups, complements, complementsOrdering]);
  useEffect(() => {
    // console.log(
    //   'setResult',
    //   !!categories,
    //   !!categoriesWithProducts,
    //   !!productsOrdering,
    //   !!complementsGroups,
    //   !!complementsOrdering,
    //   !!groupsWithComplements
    // );
    if (!categories) return;
    if (!categoriesWithProducts) return;
    if (!productsOrdering) return;
    if (!complementsGroups) return;
    if (!complementsOrdering) return;
    if (!groupsWithComplements) return;
    if (loaded) return;
    // console.log('setResult');
    setResult({
      categoriesWithProducts,
      groupsWithComplements,
      getProductCategory: (productId: string) => getParent(productsOrdering, categories, productId),
      getComplementGroup: (complementId: string) =>
        getParent(complementsOrdering, complementsGroups, complementId),
      loaded: true,
    });
    setLoaded(true);
  }, [
    categories,
    categoriesWithProducts,
    complementsGroups,
    complementsOrdering,
    groupsWithComplements,
    loaded,
    productsOrdering,
  ]);
  // logs
  // console.log('loaded', loaded);
  // console.log('useObserveBusinessMenu', businessId);
  // console.log('categories', categories?.length);
  // console.log('products', products?.length);
  // console.log(
  //   'productsOrdering',
  //   productsOrdering?.firstLevelIds?.length,
  //   productsOrdering?.secondLevelIdsByFirstLevelId?.length
  // );
  // result
  return result;
};

const ordered2 = <T extends object>(items: WithId<T>[], order: string[]): WithId<T>[] => {
  return items
    .filter((i) => order?.includes(i.id)) // filtering out first
    .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
};

export const getSorted2 = <T extends object, T2 extends object>(
  firstLevels: WithId<T>[],
  secondLevels: WithId<T2>[],
  config: Ordering | undefined
) => {
  if (firstLevels.length === 0 || !config) return [];
  const { firstLevelIds, secondLevelIdsByFirstLevelId } = config;
  return ordered2(firstLevels, firstLevelIds).map((parent) => {
    if (!secondLevelIdsByFirstLevelId) {
      return {
        ...parent,
        items: [],
      };
    }
    return {
      ...parent,
      items: ordered2(secondLevels, secondLevelIdsByFirstLevelId[parent.id]),
    };
  });
};

export const empty2 = (): Ordering => ({
  firstLevelIds: [],
  secondLevelIdsByFirstLevelId: {},
});
