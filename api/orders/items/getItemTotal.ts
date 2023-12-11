import { OrderItem } from '@appjusto/types';

export const getItemTotal = (item: OrderItem | null) => {
  if (!item) return 0;
  const complemementsTotal = (item.complements ?? []).reduce(
    (total, complement) => total + complement.price * (complement.quantity ?? 1),
    0
  );
  return item.quantity * (item.product.price + complemementsTotal);
};
