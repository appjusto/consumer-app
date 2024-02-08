import { useObserveOngoingOrders } from '@/api/orders/useObserveOngoingOrders';
import paddings from '@/common/styles/paddings';
import { useNavigation } from 'expo-router';
import { Pressable, View, ViewProps } from 'react-native';
import { HomeOngoingBusinessOrder } from './home-ongoing-business-order';

interface Props extends ViewProps {}

export const HomeOngoingOrders = ({ style, ...props }: Props) => {
  // context
  const navigation = useNavigation();
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
              // @ts-ignore
              navigation.navigate('(orders)', {
                screen: '[id]/ongoing',
                params: { id: order.id },
                initial: false,
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
