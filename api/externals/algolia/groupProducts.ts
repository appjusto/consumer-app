import { ProductAlgolia } from '@appjusto/types';

export const groupProducts = (products: ProductAlgolia[]) =>
  products.reduce((r, product) => {
    const businessList = r.find((l) => l.some((p) => p.business.id === product.business.id));
    if (!businessList) return [...r, [product]];
    businessList.push(product);
    return r;
  }, [] as ProductAlgolia[][]);
