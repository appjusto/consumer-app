import { Order } from '@appjusto/types';
import { getDispatchingStateAsText } from '../dispatching-state/getDispatchingStateAsText';

export const getOngoingOrderDescription = (order: Order) => {
  const { status, dispatchingStatus, dispatchingState, fulfillment } = order;
  if (status === 'scheduled') return 'Seu pedido foi realizado e será entregue na data agendada';
  if (status === 'preparing') {
    if (fulfillment === 'delivery') {
      return 'O seu pedido está sendo preparado e logo sairá para entrega';
    } else {
      return 'O seu pedido está sendo preparado e logo estará pronto para retirada';
    }
  }
  if (status === 'ready' || status === 'dispatching') {
    if (dispatchingState && dispatchingState !== 'idle') {
      return `A pessoa que fará a entrega está ${getDispatchingStateAsText(
        dispatchingState
      ).toLocaleLowerCase()}`;
    }
    if (dispatchingStatus === 'matching') {
      return 'Estamos procurando uma pessoa para fazer a sua entrega';
    } else if (dispatchingStatus === 'outsourced') {
      return 'Sua estrega será feita por uma empresa parceira.';
    }
  }
  return '';
};
