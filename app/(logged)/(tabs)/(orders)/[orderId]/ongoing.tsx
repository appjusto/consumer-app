import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder } from '@/api/orders/context/order-context';
import { getOrderPath } from '@/api/orders/navigation/getOrderPath';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { Loading } from '@/common/components/views/Loading';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Stack, router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { OngoingOrderCourier } from '../../../../../common/screens/orders/ongoing/ongoing-order-courier';
import { OngoingOrderDeliveryAddress } from '../../../../../common/screens/orders/ongoing/ongoing-order-delivery-address';
import { OngoingOrderEstimate } from '../../../../../common/screens/orders/ongoing/ongoing-order-delivery-estimate';
import { OngoingOrderFoodOverview } from '../../../../../common/screens/orders/ongoing/ongoing-order-food-overview';
import { OngoingOrderHandshake } from '../../../../../common/screens/orders/ongoing/ongoing-order-handshake';
import { OngoingOrderMapInfo } from '../../../../../common/screens/orders/ongoing/ongoing-order-map-info';

export default function OngoingOrderScreen() {
  // context
  const order = useContextOrder();
  const orderId = order?.id;
  const status = order?.status;
  const type = order?.type;
  // tracking
  useTrackScreenView('Pedido em andamento', { orderId, status });
  // side effects
  useEffect(() => {
    if (!status) return;
    if (!type) return;
    if (!orderId) return;
    const path = getOrderPath(status, type, 'ongoing');
    if (path) {
      router.replace({
        pathname: path,
        params: { orderId },
      });
    }
  }, [orderId, status, type]);
  // UI
  if (!order) return <Loading title="" />;
  return (
    <DefaultScrollView style={[{ flex: 1, backgroundColor: colors.neutral50 }]}>
      <Stack.Screen options={{ title: `Pedido #${order.code}` }} />
      <OngoingOrderEstimate order={order} />
      <OngoingOrderMapInfo order={order} />
      <View style={{ padding: paddings.lg, marginBottom: paddings.xl, borderWidth: 0 }}>
        <OngoingOrderCourier order={order} />
        <OngoingOrderDeliveryAddress order={order} />
        <OngoingOrderHandshake order={order} />
        <OngoingOrderFoodOverview order={order} />
      </View>
    </DefaultScrollView>
  );
}
