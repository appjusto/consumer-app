import { useObserveOrderCourierLocation } from '@/api/orders/courier/useObserveOrderCourierLocation';
import { DefaultMap } from '@/common/components/map/DefaultMap';
import { Order, WithId } from '@appjusto/types';
import { ViewProps } from 'react-native';

interface Props extends ViewProps {
  order: WithId<Order>;
  visible?: boolean;
}

export const OrderMap = ({ order, visible }: Props) => {
  // state
  const courierLocation = useObserveOrderCourierLocation(order.id, order.courier?.id);
  // UI
  if (!visible) return null;
  const origin = order.origin?.location;
  const destination = order.destination?.location;
  const polyline = order.route?.polyline;
  return (
    <DefaultMap
      origin={origin}
      destination={destination}
      polyline={polyline}
      location={courierLocation}
    />
  );
};
