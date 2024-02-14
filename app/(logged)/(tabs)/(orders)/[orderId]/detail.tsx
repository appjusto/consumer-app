import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder } from '@/api/orders/context/order-context';

import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { Loading } from '@/common/components/views/Loading';
import { formatCurrency } from '@/common/formatters/currency';
import { formatTimestamp } from '@/common/formatters/timestamp';
import { OrderDetailReview } from '@/common/screens/orders/review/order-detail-review';
import { OrderStatusBadge } from '@/common/screens/orders/status/order-status-badge';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function OrderDetailScreen() {
  // context
  const order = useContextOrder();
  const orderId = order?.id;
  // tracking
  useTrackScreenView('Detalhe do Pedido', { orderId });
  // side effects
  // UI
  if (!order) return <Loading title="Detalhe da corrida" />;
  const { type, status, code } = order;
  const baseRevenue = 0;
  const tipRevenue = 0;
  const extraRevenue = 0;

  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <Stack.Screen options={{ title: `Corrida #${code}` }} />
      <DefaultView style={{ padding: paddings.lg }}>
        <DefaultView>
          <View style={{ padding: paddings.lg }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <DefaultText size="lg" color="black">
                {`Corrida #${code}`}
              </DefaultText>
              <OrderStatusBadge style={{ marginLeft: paddings.md }} type={type} status={status} />
            </View>
            <View style={{ marginTop: paddings.lg }}>
              <DefaultText size="sm" color="neutral800">
                Entrega
              </DefaultText>
              <DefaultText size="md" style={{ marginTop: paddings['2xs'] }}>
                {formatCurrency(baseRevenue)}
              </DefaultText>
            </View>
            {tipRevenue ? (
              <View style={{ marginTop: paddings.lg }}>
                <DefaultText size="sm" color="neutral800">
                  Caixinha
                </DefaultText>
                <DefaultText size="md" style={{ marginTop: paddings['2xs'] }}>
                  {formatCurrency(tipRevenue)}
                </DefaultText>
              </View>
            ) : null}
            {extraRevenue ? (
              <View style={{ marginTop: paddings.lg }}>
                <DefaultText size="sm" color="neutral800">
                  Extras
                </DefaultText>
                <DefaultText size="md" style={{ marginTop: paddings['2xs'] }}>
                  {formatCurrency(extraRevenue)}
                </DefaultText>
              </View>
            ) : null}
            {order.dispatchingTimestamps.confirmed ? (
              <View style={{ marginTop: paddings.lg }}>
                <DefaultText size="sm" color="neutral800">
                  Aceito em
                </DefaultText>
                <DefaultText size="md" style={{ marginTop: paddings['2xs'] }}>
                  {formatTimestamp(order.dispatchingTimestamps.confirmed)}
                </DefaultText>
              </View>
            ) : null}
            {order.timestamps.delivered ? (
              <View style={{ marginTop: paddings.lg }}>
                <DefaultText size="sm" color="neutral800">
                  Entregue em
                </DefaultText>
                <DefaultText size="md" style={{ marginTop: paddings['2xs'] }}>
                  {formatTimestamp(order.timestamps.delivered)}
                </DefaultText>
              </View>
            ) : null}
            <View style={{ marginTop: paddings.lg }}>
              <DefaultText size="sm" color="neutral800">
                Retirada
              </DefaultText>
              <DefaultText
                size="md"
                style={{ marginTop: paddings['2xs'] }}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {`${order.business?.name ? `${order.business.name} - ` : ''}${order.origin?.address
                  .main}`}
              </DefaultText>
            </View>
            <View style={{ marginTop: paddings.lg }}>
              <DefaultText size="sm" color="neutral800">
                Entrega
              </DefaultText>
              <DefaultText
                size="md"
                style={{ marginTop: paddings['2xs'] }}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {order.destination?.address.main}
              </DefaultText>
            </View>
          </View>
          {/* review */}
          <OrderDetailReview style={{ marginTop: paddings.xl }} order={order} />
        </DefaultView>
      </DefaultView>
    </DefaultScrollView>
  );
}
