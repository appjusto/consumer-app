import { Order } from '@appjusto/types';
import { getDispatchingStateAsText } from '../dispatching-state/getDispatchingStateAsText';

export const getOngoingOrderDescription = (order: Order) => {
  const { status, type, dispatchingStatus, dispatchingState, fulfillment } = order;
  if (status === 'scheduled') return 'Seu pedido foi realizado e será entregue na data agendada';
  if (status === 'preparing') {
    if (fulfillment === 'delivery') {
      return 'O seu pedido está sendo preparado e logo sairá para entrega';
    } else {
      return 'O seu pedido está sendo preparado e logo estará pronto para retirada';
    }
  }
  if (status === 'ready') {
    if (dispatchingStatus === 'matching') {
      return 'Estamos procurando uma pessoa para fazer a sua entrega';
    } else if (dispatchingStatus === 'outsourced') {
      return 'Sua estrega será feita por uma empresa parceira. Lembre-se que seu pedido já foi pago 💰';
    } else if (dispatchingState && dispatchingState !== 'idle') {
      const person = order.courier?.name ? `${order.courier?.name},` : 'A pessoa';
      return `${person} que fará sua entrega, está ${getDispatchingStateAsText(
        type,
        dispatchingState
      ).toLocaleLowerCase()}`;
    }
  }
  if (status === 'dispatching') {
    if (dispatchingStatus === 'outsourced') {
      return 'Sua estrega está sendo feita por uma empresa parceira. Lembre-se que seu pedido já foi pago 💰';
    } else if (dispatchingState && dispatchingState !== 'idle') {
      const person = order.courier?.name ? `${order.courier?.name}` : 'A pessoa';
      return `${person} está ${getDispatchingStateAsText(
        type,
        dispatchingState
      ).toLocaleLowerCase()}`;
    }
  }
  return '';
};
