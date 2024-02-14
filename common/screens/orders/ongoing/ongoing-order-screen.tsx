import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder } from '@/api/orders/context/order-context';
import { getOrderStage } from '@/api/orders/status';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { Loading } from '@/common/components/views/Loading';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Stack, router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';
import { OngoingOrderCourier } from './ongoing-order-courier';
import { OngoingOrderDeliveryAddress } from './ongoing-order-delivery-address';
import { OngoingOrderEstimate } from './ongoing-order-delivery-estimate';
import { OngoingOrderFoodOverview } from './ongoing-order-food-overview';
import { OngoingOrderHandshake } from './ongoing-order-handshake';
import { OngoingOrderMapInfo } from './ongoing-order-map-info';

interface Props extends ViewProps {}

export const OngoingOrderScreenView = ({ style, ...props }: Props) => {
  // context
  const order = useContextOrder();
  const orderId = order?.id;
  const status = order?.status;
  const type = order?.type;
  // tracking
  useTrackScreenView('Pedido em andamento');
  // side effects
  useEffect(() => {
    if (!status) return;
    if (!type) return;
    if (!orderId) return;
    const stage = getOrderStage(status, type);
    if (stage === 'completed') {
      router.replace({
        pathname: '/(logged)/(tabs)/(orders)/[orderId]/delivered',
        params: { orderId },
      });
    } else if (stage !== 'ongoing') {
      router.back();
    }
  }, [orderId, status, type]);
  // UI
  if (!order) return <Loading title="" />;
  return (
    <DefaultScrollView style={[{ flex: 1, backgroundColor: colors.neutral50 }, style]} {...props}>
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
};
