import { Order } from '@appjusto/types';
import { getDispatchingStateAsText } from '../dispatching-state/getDispatchingStateAsText';

export const getOrderDescription = (order: Order) => {
  const { status, type, dispatchingStatus, dispatchingState, fulfillment, fare } = order;
  if (status === 'scheduled') return 'Seu pedido foi realizado e será entregue na data agendada';
  if (status === 'preparing') {
    if (fulfillment === 'delivery') {
      return 'O seu pedido está sendo preparado e logo sairá para entrega';
    } else {
      return 'O seu pedido está sendo preparado e logo estará pronto para retirada';
    }
  }
  if (status === 'ready') {
    if (fulfillment === 'delivery') {
      if (fare?.courier?.payee === 'business') {
        return 'Sua estrega será feita pelo próprio restaurante';
      } else if (dispatchingStatus === 'outsourced') {
        return 'Sua estrega será feita por uma empresa parceira. Lembre-se que seu pedido já foi pago 💰';
      } else if (dispatchingState && dispatchingState !== 'idle') {
        const person = order.courier?.name ? `${order.courier?.name},` : 'A pessoa';
        return `${person} que fará sua entrega, está ${getDispatchingStateAsText(
          type,
          dispatchingState
        ).toLocaleLowerCase()}`;
      }
      return 'Estamos procurando uma pessoa para fazer a sua entrega';
    } else {
      return 'O seu pedido já está pronto e já pode ser retirado';
    }
  }
  if (status === 'dispatching') {
    if (fare?.courier?.payee === 'business') {
      return 'Sua estrega está sendo feita pelo próprio restaurante';
    } else if (dispatchingStatus === 'outsourced') {
      return 'Sua estrega está sendo feita por uma empresa parceira. Lembre-se que seu pedido já foi pago 💰';
    } else if (dispatchingState && dispatchingState !== 'idle') {
      const person = order.courier?.name ? `${order.courier?.name}` : 'A pessoa';
      return `${person} está ${getDispatchingStateAsText(
        type,
        dispatchingState
      ).toLocaleLowerCase()}`;
    }
  }
  if (status === 'confirmed') {
    if (type === 'p2p') return 'Procurando uma pessoa para realizar a sua entrega.';
  }
  if (status === 'delivered') {
    return 'Seu pedido foi finalizado com sucesso!';
  }
  if (status === 'canceled') {
    return 'Seu pedido foi cancelado';
  }
  if (status === 'declined') {
    return 'Tivemos um problema ao processar o seu pagamento.';
  }
  return '';
};
