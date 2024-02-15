import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { getOrderStage } from '@/api/orders/status';
import { useObserveOngoingOrders } from '@/api/orders/useObserveOngoingOrders';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HistoryBusinessOrder } from '@/common/screens/orders/history/history-business-order';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Order, WithId } from '@appjusto/types';
import { router } from 'expo-router';
import { Pressable } from 'react-native';

export default function OrdersIndex() {
  // tracking
  useTrackScreenView('Pedidos');
  // state
  const orders = useObserveOngoingOrders() ?? [];
  // handlers
  const handleClick = (order: WithId<Order>) => {
    const { status, type } = order;
    const stage = getOrderStage(status, type);
    console.log(order.id, stage);
    if (stage === 'placing') {
      router.navigate({
        pathname: '/(logged)/(tabs)/(orders)/[orderId]/confirming',
        params: { orderId: order.id },
      });
    } else if (stage === 'ongoing') {
      console.log('/(logged)/(tabs)/(orders)/[orderId]/ongoing', order.id);
      router.navigate({
        pathname: '/(logged)/(tabs)/(orders)/[orderId]/ongoing',
        params: { orderId: order.id },
      });
    }
  };
  // UI
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <DefaultView style={{ ...screens.headless, padding: paddings.lg }}>
        <DefaultText size="lg">Meus pedidos</DefaultText>
        {orders.length ? <DefaultText size="md">Pedidos em aberto</DefaultText> : null}
        {orders.map((order) => (
          <Pressable key={order.id} onPress={() => handleClick(order)}>
            <HistoryBusinessOrder order={order} />
          </Pressable>
        ))}
      </DefaultView>
    </DefaultScrollView>
  );
}
