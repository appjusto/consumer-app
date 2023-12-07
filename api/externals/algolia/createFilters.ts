import { SearchFilter, SearchKind } from './types';

export const createFilters = (kind: SearchKind, filters?: SearchFilter[]) => {
  const businessEnabledFilter =
    kind === 'restaurant' ? 'enabled:true' : '(enabled:true AND business.enabled:true)';
  if (!filters || filters.length === 0) return businessEnabledFilter;
  return (
    businessEnabledFilter +
    ' AND (' +
    filters
      .reduce<string[]>((result, filter) => {
        if (filter.type === 'cuisine') {
          return [...result, `cuisine:${filter.value}`];
        } else if (filter.type === 'classification') {
          return [...result, `classifications:"${filter.value}"`];
        } else if (filter.type === 'tag') {
          return [...result, `tags:${filter.value}`];
        } else if (filter.type === 'paymentMethod') {
          // TODO:
        }
        return result;
      }, [])
      .join(' OR ') +
    ')'
  );
};
