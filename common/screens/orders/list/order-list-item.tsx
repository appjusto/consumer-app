import { isOrderOngoing } from '@/api/orders/status';
import { Order, WithId } from '@appjusto/types';
import { ViewProps } from 'react-native';
import { HomeOngoingBusinessOrder } from '../ongoing-orders/home-ongoing-business-order';
import { HomeOngoingP2POrder } from '../ongoing-orders/home-ongoing-p2p-order';
import { BusinessOrder } from './business-order';
import { P2POrder } from './p2p-order';

interface Props extends ViewProps {
  order: WithId<Order>;
}

export const OrderListItem = ({ order, ...props }: Props) => {
  const { type, status } = order;
  if (type === 'food') {
    if (isOrderOngoing(status)) return <HomeOngoingBusinessOrder order={order} {...props} />;
    return <BusinessOrder order={order} {...props} />;
  }
  if (isOrderOngoing(status)) return <HomeOngoingP2POrder order={order} {...props} />;
  return <P2POrder order={order} {...props} />;
};
