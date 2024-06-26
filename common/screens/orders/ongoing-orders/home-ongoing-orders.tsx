import { routeOrder } from '@/api/orders/navigation/routeOrder';
import { useObserveOngoingOrders } from '@/api/orders/useObserveOngoingOrders';
import paddings from '@/common/styles/paddings';
import { Order, OrderType, WithId } from '@appjusto/types';
import { Pressable, View, ViewProps } from 'react-native';
import { HomeOngoingBusinessOrder } from './home-ongoing-business-order';
import { HomeOngoingP2POrder } from './home-ongoing-p2p-order';

interface Props extends ViewProps {
  type: OrderType;
}

export const OngoingOrders = ({ type, style, ...props }: Props) => {
  // state
  const orders = useObserveOngoingOrders(type);
  // handlers
  const orderHandler = (order: WithId<Order>) => {
    routeOrder(order.id, order.status, order.type, order.paymentMethod);
  };
  // UI
  if (!orders?.length) return null;
  return (
    <View style={[{}, style]} {...props}>
      {orders.map((order) => {
        return (
          <Pressable
            key={order.id}
            style={{ marginBottom: paddings.sm }}
            onPress={() => orderHandler(order)}
          >
            {order.type === 'food' ? <HomeOngoingBusinessOrder order={order} /> : null}
            {order.type === 'p2p' ? <HomeOngoingP2POrder order={order} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
};
