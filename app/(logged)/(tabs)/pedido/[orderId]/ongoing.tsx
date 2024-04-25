import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder } from '@/api/orders/context/order-context';
import { isOrderOngoing } from '@/api/orders/status';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { OngoingOrderCourier } from '@/common/screens/orders/ongoing/ongoing-order-courier';
import { OngoingOrderPickupAddress } from '@/common/screens/orders/ongoing/ongoing-order-pickup-address';
import { OngoingOrderShareLink } from '@/common/screens/orders/ongoing/ongoing-order-share-link';
import { ScreenTitle } from '@/common/screens/title/screen-title';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
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
  // state
  const isFocused = useIsFocused();
  // tracking
  useTrackScreenView('Pedido em andamento', { orderId, status });
  // side effects
  useEffect(() => {
    if (!orderId) return;
    if (!status) return;
    if (!isFocused) return;
    if (isOrderOngoing(status)) return;
    router.replace({
      pathname: '/(logged)/(tabs)/pedido/[orderId]/completed',
      params: { orderId },
    });
  }, [orderId, status, isFocused]);
  // UI
  if (!order) return <ScreenTitle title="Pedido em andamento" loading />;
  const { code } = order;
  return (
    <DefaultScrollView style={[{ flex: 1, backgroundColor: colors.neutral50 }]}>
      <ScreenTitle title={`Pedido #${code}`} />
      <OngoingOrderEstimate order={order} />
      <OngoingOrderMapInfo order={order} />
      <View style={{ padding: paddings.lg, marginBottom: paddings.xl, borderWidth: 0 }}>
        <OngoingOrderCourier order={order} />
        <OngoingOrderHandshake order={order} />
        <OngoingOrderShareLink order={order} />
        <OngoingOrderPickupAddress order={order} />
        <OngoingOrderDeliveryAddress order={order} />
        <OngoingOrderFoodOverview order={order} />
      </View>
    </DefaultScrollView>
  );
}
