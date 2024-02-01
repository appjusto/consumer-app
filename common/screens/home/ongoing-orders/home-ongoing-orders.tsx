import { useObserveOngoingOrders } from '@/api/orders/useObserveOngoingOrders';
import paddings from '@/common/styles/paddings';
import { router } from 'expo-router';
import { Pressable, View, ViewProps } from 'react-native';
import { HomeOngoingBusinessOrder } from './home-ongoing-business-order';

interface Props extends ViewProps {}

export const HomeOngoingOrders = ({ style, ...props }: Props) => {
  // state
  const orders = useObserveOngoingOrders();
  // UI
  if (!orders?.length) return null;
  return (
    <View style={[{ paddingHorizontal: paddings.lg }, style]} {...props}>
      {orders.map((order) => {
        return (
          <Pressable
            key={order.id}
            style={{ marginBottom: paddings.sm }}
            onPress={() => {
              router.push({
                pathname: '/(logged)/(tabs)/(orders)/[id]/ongoing',
                params: { id: order.id },
              });
            }}
          >
            {order.type === 'food' ? <HomeOngoingBusinessOrder order={order} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
};
