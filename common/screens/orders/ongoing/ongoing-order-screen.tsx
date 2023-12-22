import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useObserveOrder } from '@/api/orders/useObserveOrder';
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
    <View style={[{}, style]} {...props}>
      <Stack.Screen options={{ title: `Pedido #${order.code}` }} />
      {/* estimate */}
      <OngoingOrderEstimate order={order} />
      {/* map */}
      <OrderMap order={order} />
      <View style={{ padding: paddings.lg, backgroundColor: colors.neutral50 }}>
        <View>
          <OngoingOrderStatusMessageBox order={order} />
        </View>
        <OngoingOrderDeliveryAddress style={{ marginTop: paddings.lg }} order={order} />
        <OngoingOrderHandshake style={{ marginTop: paddings.lg }} order={order} />
        <OngoingOrderEstimateFoodOverview style={{ marginTop: paddings.lg }} order={order} />
      </View>
    </View>
  );
};
