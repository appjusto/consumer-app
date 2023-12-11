import { OrderItemComplement, Product } from '@appjusto/types';
import { hasSatisfiedGroup } from './hasSatisfiedGroup';

export const hasSatisfiedAllGroups = (product: Product, complements: OrderItemComplement[]) =>
  !product.complementsGroups?.length ||
  product.complementsGroups.every((group) => hasSatisfiedGroup(group, complements)) === true;
