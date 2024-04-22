import { OrderStatus, OrderType } from '@appjusto/types';

export const getOrderStatusAsText = (type: OrderType, status: OrderStatus) => {
  if (status === 'quote') return 'Cotação';
  if (status === 'confirming') return 'Confirmando';
  if (status === 'declined') return 'Recusado';
  if (status === 'rejected') return 'Rejeitado';
  if (status === 'charged') return 'Confirmando';
  if (status === 'confirmed') {
    if (type === 'food') return 'Aguardando restaurante';
    return 'Aguardando entregador/a';
  }
  if (status === 'scheduled') return 'Agendado';
  if (status === 'preparing') return 'Em preparo';
  if (status === 'ready') return 'Pronto';
  if (status === 'delivered') return 'Entregue';
  if (status === 'dispatching') return 'A caminho';
  if (status === 'canceled') return 'Cancelado';
  if (status === 'expired') return 'Expirado';
  return '';
};
