import { DefaultMap } from '@/common/components/map/DefaultMap';
import { Order, WithId } from '@appjusto/types';
import { ViewProps } from 'react-native';

interface Props extends ViewProps {
  order: WithId<Order>;
}

export const OrderMap = ({ order }: Props) => {
  // state
  const { status } = order;
  const origin = order.origin?.location;
  const destination = order.destination?.location;
  const polyline = order.route?.polyline;
  // UI
  if (status === 'confirming') return null;
  if (status === 'confirmed') return null;
  if (status === 'preparing') return null;
  return <DefaultMap origin={origin} destination={destination} polyline={polyline} />;
};
