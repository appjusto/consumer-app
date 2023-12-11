import { Order } from '@appjusto/types';

export const removeItemFromOrder = (order: Order, itemId: string): Order => {
  if (!order?.items) return order;
  const index = order.items.findIndex((i) => i.id === itemId);
  if (index === -1) return order;
  return {
    ...order,
    items: [...order.items.slice(0, index), ...order.items.slice(index + 1)],
  };
};
