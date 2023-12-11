import { Order } from '@appjusto/types';

export const updateOrderItemQuantity = (order: Order, itemId: string, quantity: number): Order => {
  if (!order.items) return order;
  const index = order.items.findIndex((i) => i.id === itemId);
  if (index === -1) return order;
  return {
    ...order,
    items: [
      ...order.items.slice(0, index),
      { ...order.items[index], quantity },
      ...order.items.slice(index + 1),
    ],
  };
};
