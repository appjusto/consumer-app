import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useObserveOrderCancellation } from '@/api/orders/cancellation/useObserveOrderCancellation';
import { useContextOrder } from '@/api/orders/context/order-context';
import { FailedOrdersStatuses } from '@/api/orders/status';

import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { Loading } from '@/common/components/views/Loading';
import { MessageBox } from '@/common/components/views/MessageBox';
import { OngoingOrderFoodOverview } from '@/common/screens/orders/ongoing/ongoing-order-food-overview';
import { OngoingOrderStatusMessageBox } from '@/common/screens/orders/ongoing/ongoing-order-status-message-box';
import { OrderDetailReview } from '@/common/screens/orders/review/order-detail-review';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Stack } from 'expo-router';

export default function OrderCompletedScreen() {
  // context
  const order = useContextOrder();
  const orderId = order?.id;
  // state
  const cancellation = useObserveOrderCancellation(
    orderId,
    order?.status && FailedOrdersStatuses.includes(order.status)
  );
  const productsRefunded = cancellation?.params?.refund?.includes('products');
  const deliveryRefunded = cancellation?.params?.refund?.includes('delivery');
  const fullRefund = productsRefunded && deliveryRefunded;
  const refundText = (() => {
    if (fullRefund) return 'Este pedido foi reembolsado integralmente.';
    if (productsRefunded) return 'O valor referente aos produtos foi reembolsado.';
    if (deliveryRefunded) return 'O valor da entrega foi reembolsado.';
    return null;
  })();
  console.log('cancellation', cancellation);
  console.log('productsRefunded', productsRefunded);
  // tracking
  useTrackScreenView('Detalhe do Pedido', { orderId });
  // side effects
  // UI
  if (!order) return <Loading title="Detalhe do pedido" />;
  const { code } = order;
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <Stack.Screen options={{ title: `Pedido #${code}` }} />
      <DefaultView style={{ padding: paddings.lg }}>
        <OngoingOrderStatusMessageBox order={order} />
        {refundText ? (
          <MessageBox style={{ marginTop: paddings.lg }} variant="info">
            {refundText}
          </MessageBox>
        ) : null}
        <OngoingOrderFoodOverview style={{ marginTop: paddings.lg }} order={order} />
        <OrderDetailReview style={{ marginTop: paddings.lg }} order={order} />
      </DefaultView>
    </DefaultScrollView>
  );
}
