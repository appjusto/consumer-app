import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useObserveOrder } from '@/api/orders/useObserveOrder';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { Loading } from '@/common/components/views/Loading';
import { OrderMap } from '@/common/screens/orders/map/order-map';
import { useRouterAccordingOrderStatus } from '@/common/screens/orders/useRouterAccordingOrderStatus';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';
import { OngoingOrderDeliveryAddress } from './ongoing-order-delivery-address';
import { OngoingOrderEstimate } from './ongoing-order-delivery-estimate';
import { OngoingOrderEstimateFoodOverview } from './ongoing-order-food-overview';
import { OngoingOrderHandshake } from './ongoing-order-handshake';
import { OngoingOrderStatusMessageBox } from './ongoing-order-status-message-box';

interface Props extends ViewProps {
  orderId: string;
}

export const OngoingOrderScreenView = ({ orderId, style, ...props }: Props) => {
  // state
  const order = useObserveOrder(orderId);
  const orderStatus = order?.status;
  // tracking
  useTrackScreenView('Pedido em andamento');
  // side effects
  useRouterAccordingOrderStatus(orderId, orderStatus, true);
  // UI
  if (!order) return <Loading title="Pedido em andamento" />;
  return (
    <DefaultScrollView style={[{ flex: 1, backgroundColor: colors.neutral50 }, style]} {...props}>
      <Stack.Screen options={{ title: `Pedido #${order.code}` }} />
      <OngoingOrderEstimate order={order} />
      <OrderMap order={order} />
      <View style={{ flex: 1, padding: paddings.lg }}>
        <OngoingOrderStatusMessageBox order={order} />
        <OngoingOrderDeliveryAddress style={{ marginTop: paddings.lg }} order={order} />
        <OngoingOrderHandshake style={{ marginTop: paddings.lg }} order={order} />
        <OngoingOrderEstimateFoodOverview style={{ marginTop: paddings.lg }} order={order} />
      </View>
    </DefaultScrollView>
  );
};
