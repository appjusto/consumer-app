import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useObserveOrderCancellation } from '@/api/orders/cancellation/useObserveOrderCancellation';
import { useContextOrder } from '@/api/orders/context/order-context';
import { FailedOrdersStatuses } from '@/api/orders/status';
import { useContextCurrentPlace } from '@/api/preferences/context/PreferencesContext';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';

import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { Loading } from '@/common/components/views/Loading';
import { MessageBox } from '@/common/components/views/MessageBox';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { OngoingOrderFoodOverview } from '@/common/screens/orders/ongoing/ongoing-order-food-overview';
import { OngoingOrderStatusMessageBox } from '@/common/screens/orders/ongoing/ongoing-order-status-message-box';
import { OrderDetailReview } from '@/common/screens/orders/review/order-detail-review';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Order, Place, WithId } from '@appjusto/types';
import { Stack, router } from 'expo-router';
import { pick } from 'lodash';
import { useState } from 'react';
import { View } from 'react-native';

export default function OrderCompletedScreen() {
  // context
  const order = useContextOrder();
  const api = useContextApi();
  const showToast = useShowToast();
  const currentPlace = useContextCurrentPlace();
  const orderId = order?.id;
  const business = order?.business;
  // state
  const [createEnabled, setCreateEnabled] = useState(true);
  const declined = order?.status === 'declined' || order?.status === 'rejected';
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
  // tracking
  useTrackScreenView('Detalhe do Pedido', { orderId });
  // handlers
  const createOrderHandler = () => {
    if (!order) return;
    // console.log(business);
    setCreateEnabled(false);
    const promise = business
      ? api.business().fetchBusinessById(business.id)
      : Promise.resolve(null);
    promise
      .then((value) => {
        if (order.type === 'food') {
          if (!value) throw new Error('Restaurante indisponível');
          const newOrder: Partial<Order> = {
            ...pick(order, ['items', 'destination', 'fulfillment']),
            destination: order.destination ?? (currentPlace as WithId<Place>) ?? null,
          };
          if (declined) newOrder.paymentMethod = 'pix';
          return api.orders().createFoodOrder(value, newOrder);
        } else {
          const newOrder: Partial<Order> = {
            ...pick(order, ['origin', 'destination']),
          };
          if (declined) newOrder.paymentMethod = 'pix';
          return api.orders().createP2POrder(newOrder);
        }
      })
      .then((orderId) => {
        router.navigate({
          pathname: '/(logged)/checkout/[orderId]/',
          params: { orderId },
        });
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : 'Não foi possível criar o pedido';
        showToast(message, 'error');
      });
  };
  // logs
  // console.log('cancellation', cancellation);
  // console.log('productsRefunded', productsRefunded);
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
        {declined ? (
          <View>
            <DefaultText size="md" style={{ marginTop: paddings.lg }}>
              Você pode tentar novamente com outra forma de pagamento.
            </DefaultText>
          </View>
        ) : null}
        <DefaultButton
          style={{ marginTop: paddings.lg }}
          title="Refazer pedido"
          disabled={!order || !createEnabled}
          onPress={createOrderHandler}
        />
      </DefaultView>
    </DefaultScrollView>
  );
}
