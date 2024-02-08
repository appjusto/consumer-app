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
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Pressable } from 'react-native';

export default function OrdersIndex() {
  // params
  const params = useLocalSearchParams<{ orderId: string }>();
  const orderId = params.orderId;
  useTrackScreenView('Pedidos');
  // state
  const orders = useObserveOngoingOrders() ?? [];
  // side effects
  useEffect(() => {
    console.log('### home', orderId);
    if (orderId) {
      router.navigate({
        pathname: '/(logged)/(tabs)/(orders)/[id]/',
        params: { id: orderId },
      });
      router.setParams({ orderId: '' });
    }
  }, [orderId]);
  // handlers
  const handleClick = (order: WithId<Order>) => {
    const { status, type } = order;
    const stage = getOrderStage(status, type);
    if (stage === 'ongoing') {
      router.navigate({
        pathname: '/(logged)/(tabs)/(orders)/[id]/ongoing',
        params: { id: order.id },
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
