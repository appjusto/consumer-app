import { getAppjustoURL } from '@/common/constants/urls';
import { Order, WithId } from '@appjusto/types';

export const getOrderShareLink = (order: WithId<Order>) =>
  getAppjustoURL(`/pedido/${order.id}/${order.shareToken}`);
