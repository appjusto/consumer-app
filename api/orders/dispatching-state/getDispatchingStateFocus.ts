import { DispatchingState } from '@appjusto/types';

export const getDispatchingStateFocus = (dispatchingState?: DispatchingState | null) => {
  if (!dispatchingState) return 'pickup';
  if (dispatchingState === 'going-pickup') return 'pickup';
  if (dispatchingState === 'arrived-pickup') return 'pickup';
  return 'destination';
};
