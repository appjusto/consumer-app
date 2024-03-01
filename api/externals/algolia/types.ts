export type SearchKind = 'restaurant' | 'product' | 'fleet';
export type SearchOrder =
  | 'distance'
  | 'price'
  | 'preparation-time'
  | 'popularity'
  | 'average-discount'
  | 'reviews';
export type SearchFilter = {
  type: 'cuisine' | 'classification' | 'tag' | 'paymentMethod';
  value: string;
};
