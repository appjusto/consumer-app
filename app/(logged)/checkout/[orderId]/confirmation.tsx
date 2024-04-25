import { useContextApi } from '@/api/ApiContext';
import { trackEvent } from '@/api/analytics/track';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { checkoutHasIssue } from '@/api/orders/checkout/checkoutHasIssue';
import { useCheckoutIssues } from '@/api/orders/checkout/useCheckoutIssues';
import { useContextOrder } from '@/api/orders/context/order-context';
import { useContextPayments } from '@/api/orders/payment/context/payments-context';
import { usePlaceOrderOptions } from '@/api/orders/payment/usePlaceOrderOptions';
import { getOrderTotalCost } from '@/api/orders/total/getOrderTotalCost';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { MessageBox } from '@/common/components/views/MessageBox';
import { HRShadow } from '@/common/components/views/hr-shadow';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { OrderSelectedDestination } from '@/common/screens/orders/checkout/confirmation/order-selected-destination';
import { OrderSelectedPayment } from '@/common/screens/orders/checkout/confirmation/order-selected-payment';
import { OrderSelectedSchedule } from '@/common/screens/orders/checkout/confirmation/order-selected-schedule';
import { ReviewP2POrder } from '@/common/screens/orders/p2p/review-p2p-order';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import crashlytics from '@react-native-firebase/crashlytics';
import { Stack, router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

export default function OrderCheckoutDeliveryScreen() {
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  const quote = useContextOrder();
  const { paymentMethod, selectedCard } = useContextPayments();
  // state
  const issues = useCheckoutIssues(true, true);
  const placeOptions = usePlaceOrderOptions();
  // state
  const [loading, setLoading] = useState(false);
  // tracking
  useTrackScreenView('Checkout: pagamento', {
    businessId: quote?.business?.id,
    orderId: quote?.id,
  });
  // side effects
  useFocusEffect(
    useCallback(() => {
      console.log('useFocusEffect');
      setLoading(false);
    }, [])
  );
  // useBackWhenOrderExpires(!loading);
  // handlers
  const canPlaceOrder = Boolean(placeOptions) && !issues.length;
  const paidWithPix = placeOptions?.payment.payableWith === 'pix';
  const placeOrder = async () => {
    if (!placeOptions) return;
    console.log(placeOptions);
    setLoading(true);
    if (quote?.status === 'declined') {
      await api.orders().updateOrder(quote.id, { status: 'quote' });
    }
    try {
      await api.orders().placeOrder(placeOptions);
      trackEvent('Pedido feito');
      if (paidWithPix) {
        router.navigate({
          pathname: '/checkout/[orderId]/confirming-pix',
          params: { orderId: placeOptions.orderId },
        });
      } else {
        router.navigate({
          pathname: '/checkout/[orderId]/confirming',
          params: { orderId: placeOptions.orderId },
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message, 'error');
        crashlytics().recordError(error);
      }
    }
  };
  const completeProfileHandler = () => {
    if (!quote) return;
    router.navigate({
      pathname: '/(logged)/checkout/[orderId]/profile',
      params: { orderId: quote.id },
    });
  };
  // logs
  console.log('checkout/[orderId]/confirmation', typeof quote, quote?.id);
  // console.log(placeOptions);
  // UI
  if (!quote) return null;
  const deliveryOrTakeAway = quote.fulfillment === 'delivery' ? 'Entrega' : 'Retirada';
  return (
    <View style={{ ...screens.default }}>
      <DefaultScrollView>
        <Stack.Screen options={{ title: 'Confirme seu pedido' }} />
        <DefaultView style={{ padding: paddings.lg }}>
          <DefaultText size="lg">{deliveryOrTakeAway}</DefaultText>
          <OrderSelectedSchedule style={{ marginTop: paddings.lg }} />
          {quote.type === 'food' ? (
            <>
              <DefaultText style={{ marginTop: paddings.lg }} size="lg">
                {`Endereço de ${deliveryOrTakeAway}`}
              </DefaultText>
              <OrderSelectedDestination style={{ marginTop: paddings.lg }} />
            </>
          ) : (
            <ReviewP2POrder style={{ marginTop: paddings.lg }} quote={quote} />
          )}

          <DefaultText style={{ marginTop: paddings.lg }} size="lg">
            Pagamento
          </DefaultText>
          <OrderSelectedPayment
            style={{ marginTop: paddings.lg }}
            paymentMethod={paymentMethod}
            card={selectedCard}
            value={getOrderTotalCost(quote)}
          />
          {placeOptions?.additionalInfo ? (
            <View style={{ marginTop: paddings.lg }}>
              <DefaultText size="lg">Observações</DefaultText>
              <DefaultText style={{ marginTop: paddings.lg }}>
                {placeOptions.additionalInfo}
              </DefaultText>
            </View>
          ) : null}
        </DefaultView>

        <View style={{ flex: 1 }} />
        {issues.length ? (
          <MessageBox variant="warning" style={{ margin: paddings.lg, marginTop: 0 }}>
            {issues[0].description}
          </MessageBox>
        ) : null}
        {quote.status === 'declined' ? (
          <MessageBox variant="error" style={{ margin: paddings.lg, marginTop: 0 }}>
            {quote.issue ??
              'Transação não autorizada. Tente novamente com outra forma de pagamento.'}
          </MessageBox>
        ) : null}
      </DefaultScrollView>
      <View>
        <HRShadow />
        <View
          style={{
            padding: paddings.lg,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flex: 1 }}>
            <DefaultButton
              title="Alterar pedido"
              variant="outline"
              onPress={() =>
                router.navigate({
                  pathname: '/(logged)/checkout/[orderId]/delivery',
                  params: { orderId: quote.id },
                })
              }
            />
          </View>
          <View style={{ flex: 1, marginLeft: paddings.lg }}>
            {issues.length === 0 ? (
              <DefaultButton
                title="Confirmar pedido"
                onPress={placeOrder}
                disabled={!canPlaceOrder || loading}
                loading={loading}
              />
            ) : null}
            {checkoutHasIssue(issues, 'profile-incomplete') ? (
              <DefaultButton title="Finalizar cadastro" onPress={completeProfileHandler} />
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}
