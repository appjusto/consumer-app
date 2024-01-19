import { IssueType, Order } from '@appjusto/types';

export const issueTypeForOrder = (order: Order | undefined | null): IssueType | null => {
  if (!order) return null;
  const { type, status, dispatchingState } = order;
  if (type === 'food') {
    if (status === 'delivered') {
      return 'consumer-delivered-food-order';
    } else if (dispatchingState === 'going-destination') {
      return 'consumer-ongoing-food';
    } else if (dispatchingState === 'arrived-destination') {
      return 'consumer-arrived-food-order';
    } else {
      return 'consumer-going-pickup-food';
    }
  } else if (type === 'p2p') {
    if (status === 'delivered') {
      return 'consumer-delivered-p2p-order';
    } else if (dispatchingState === 'going-destination') {
      return 'consumer-ongoing-p2p';
    } else if (dispatchingState === 'arrived-destination') {
      return 'consumer-arrived-p2p-order';
    } else {
      return 'consumer-going-pickup-p2p';
    }
  }
  return null;
};
