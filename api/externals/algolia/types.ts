export type SearchKind = 'restaurant' | 'product' | 'fleet';
export type SearchOrder =
  | 'distance'
  | 'price'
  | 'preparation-time'
  | 'popularity'
  | 'average-discount'
  | 'reviews';
export type SearchFilterType =
  | 'cuisine'
  | 'classification'
  | 'tags'
  | 'preparationModes'
  | 'acceptedPaymentMethods'
  | 'fulfillment'
  | 'discount';

export type SearchFilter = {
  type: SearchFilterType;
  value: string;
};
