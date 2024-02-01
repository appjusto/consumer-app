import { getParent, getSorted } from '@appjusto/menu';
import { useObserveBusinessCategories } from './useObserveBusinessCategories';
import { useObserveBusinessComplements } from './useObserveBusinessComplements';
import { useObserveBusinessMenuOrder } from './useObserveBusinessMenuOrder';
import { useObserveBusinessProducts } from './useObserveBusinessProducts';

export const useObserveBusinessMenu = (businessId?: string) => {
  const categories = useObserveBusinessCategories(businessId);
  const products = useObserveBusinessProducts(businessId);
  const productsOrdering = useObserveBusinessMenuOrder(businessId);
  const categoriesWithProducts = getSorted(categories ?? [], products ?? [], productsOrdering);
  const { complementsGroups, complements } = useObserveBusinessComplements(businessId);
  const complementsOrdering = useObserveBusinessMenuOrder(businessId, 'complements');
  const groupsWithComplements = getSorted(
    complementsGroups ?? [],
    complements ?? [],
    complementsOrdering
  );
  const loaded =
    Boolean(categories) &&
    Boolean(products) &&
    Boolean(productsOrdering) &&
    Boolean(complementsGroups) &&
    Boolean(complements);
  return {
    categoriesWithProducts,
    groupsWithComplements,
    getProductCategory: (productId: string) =>
      productsOrdering ? getParent(productsOrdering, categories, productId) : undefined,
    getComplementGroup: (complementId: string) =>
      complementsOrdering
        ? getParent(complementsOrdering, complementsGroups, complementId)
        : undefined,
    loaded,
  };
};
