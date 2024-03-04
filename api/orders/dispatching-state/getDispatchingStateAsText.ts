import { DispatchingState, OrderType } from '@appjusto/types';

export const getDispatchingStateAsText = (
  type: OrderType,
  dispatchingState?: DispatchingState | null
) => {
  const origin = type === 'food' ? 'restaurante' : 'local de coleta';
  if (dispatchingState === 'going-pickup') return `Indo para o ${origin}`;
  if (dispatchingState === 'arrived-pickup') return `No ${origin}`;
  if (dispatchingState === 'going-destination') return `Indo para a entrega`;
  if (dispatchingState === 'arrived-destination') return `No local de entrega`;
  return '';
};
