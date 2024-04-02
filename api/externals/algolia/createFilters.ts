import { SearchFilter, SearchFilterType, SearchKind } from './types';

export const createFilters = (kind: SearchKind, filters?: SearchFilter[]) => {
  if (kind === 'restaurant') return createBusinessesFilters(filters);
  if (kind === 'product') return createProductsFilters(filters);
  return '';
};

const createBusinessesFilters = (filters: SearchFilter[] = []) => {
  let result = 'enabled:true';
  if (!filters.length) return result;
  result += reduce(filters, 'tags');
  result += reduce(filters, 'cuisine');
  result += reduce(filters, 'acceptedPaymentMethods');
  const discount = filters.find((filter) => filter.type === 'discount');
  if (discount) result += ` AND averageDiscount>=${discount.value}`;
  console.log(result);
  return result;
};

const createProductsFilters = (filters: SearchFilter[] = []) => {
  let result = 'enabled:true AND business.enabled:true';
  result += reduce(filters, 'classification');
  console.log(result);
  return result;
};

const reduce = (filters: SearchFilter[], type: SearchFilterType) => {
  const selected = filters.filter((filter) => filter.type === type);
  if (!selected.length) return '';
  return (
    ' AND (' +
    selected
      .reduce<string[]>((r, filter) => [...r, `${filter.type}:${filter.value}`], [])
      .join(' OR ') +
    ')'
  );
};
