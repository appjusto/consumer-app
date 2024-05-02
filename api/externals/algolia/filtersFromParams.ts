// https://appjusto.com.br/busca/?acceptedPaymentMethods=vr-alimentação

import { pick } from 'lodash';
import { SearchFilter, SearchFilterType } from './types';

export const filtersFromParams = (params: { [key: string]: string }) => {
  const filters: SearchFilter[] = [];
  // console.log('filtersFromParams', params);
  if (params.method) params.acceptedPaymentMethods = params.method;
  for (const k in pick(params, [
    'acceptedPaymentMethods',
    'tags',
    'classification',
    'discount',
    'fulfillment',
    'cuisine',
  ] as SearchFilterType[])) {
    params[k].split(';').forEach((value) => {
      filters.push({ type: k as SearchFilterType, value });
    });
  }
  // console.log('filtersFromParams', filters);
  return filters;
};
