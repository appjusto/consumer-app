import { isOrderOngoing } from '@/api/orders/status';
import { Order, WithId } from '@appjusto/types';
import { ViewProps } from 'react-native';
import { HomeOngoingBusinessOrder } from '../../home/ongoing-orders/home-ongoing-business-order';
import { BusinessOrder } from './business-order';

interface Props extends ViewProps {
  order: WithId<Order>;
}

export const OrderListItem = ({ order, ...props }: Props) => {
  const { type, status } = order;
  if (type === 'food') {
    if (isOrderOngoing(status)) return <HomeOngoingBusinessOrder order={order} {...props} />;
    return <BusinessOrder order={order} {...props} />;
  }
  // TODO: P2P
  return null;
};
