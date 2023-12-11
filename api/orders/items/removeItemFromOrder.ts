import { Order, OrderItem } from '@appjusto/types';

export const removeItemFromOrder = (order: Order, item: OrderItem): Order => {
  if (!order?.items) return order;
  const index = order.items.findIndex((i) => i.id === item.id);
  if (index === -1) return order;
  return {
    ...order,
    items: [...order.items.slice(0, index), ...order.items.slice(index + 1)],
  };
};
