import { SearchFilter } from '@/api/externals/algolia/types';
import { BusinessTag, PayableWith } from '@appjusto/types';

export const tagAdded = (filters: SearchFilter[], value: BusinessTag) =>
  filters.some((filter) => filter.type === 'tags' && filter.value === value);

export const toggleTag = (filters: SearchFilter[], value: BusinessTag) =>
  filters
    .filter((filter) => filter.type !== 'tags' || filter.value !== value)
    .filter((filter) => value !== 'appjusto-only' || filter.type !== 'discount')
    .concat(tagAdded(filters, value) ? [] : [{ type: 'tags', value }]);

export const discountAdded = (filters: SearchFilter[], value: string) =>
  filters.some((filter) => filter.type === 'discount' && filter.value === value);

export const toggleDiscount = (filters: SearchFilter[], value: string) =>
  filters
    .filter(
      (filter) =>
        filter.type !== 'discount' && filter.type !== 'tags' && filter.value !== 'appjusto-only'
    )
    .concat(discountAdded(filters, value) ? [] : [{ type: 'discount', value }]);

export const cuisineAdded = (filters: SearchFilter[], cuisineName: string) =>
  filters.some((filter) => filter.type === 'cuisine' && filter.value === cuisineName);

export const toggleCuisine = (filters: SearchFilter[], cuisineName: string) =>
  filters
    .filter((filter) => filter.type !== 'cuisine' || filter.value !== cuisineName)
    .concat(cuisineAdded(filters, cuisineName) ? [] : [{ type: 'cuisine', value: cuisineName }]);

export const paymentAdded = (filters: SearchFilter[], value: string) =>
  filters.some((filter) => filter.type === 'acceptedPaymentMethods' && filter.value === value);

export const togglePayment = (filters: SearchFilter[], value: PayableWith) =>
  filters
    .filter((filter) => filter.type !== 'acceptedPaymentMethods' || filter.value !== value)
    .concat(paymentAdded(filters, value) ? [] : [{ type: 'acceptedPaymentMethods', value }]);
