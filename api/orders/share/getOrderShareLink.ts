import { getEnv } from '@/extra';
import { Order, WithId } from '@appjusto/types';

export const getOrderShareLink = (order: WithId<Order>) => {
  return `https://${getEnv() === 'live' ? '' : `${getEnv()}.`}appjusto.com.br/pedido/${order.id}/${
    order.shareToken
  }`;
};
