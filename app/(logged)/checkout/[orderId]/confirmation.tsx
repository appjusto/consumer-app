import { useContextApi } from '@/api/ApiContext';
import { trackEvent } from '@/api/analytics/track';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useCheckoutIssues } from '@/api/orders/checkout/useCheckoutIssues';
import { useContextOrder } from '@/api/orders/context/order-context';
import { useContextPayments } from '@/api/orders/payment/context/payments-context';
import { usePlaceOrderOptions } from '@/api/orders/payment/usePlaceOrderOptions';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HRShadow } from '@/common/components/views/hr-shadow';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { OrderSelectedDestination } from '@/common/screens/orders/checkout/confirmation/order-selected-destination';
import { OrderSelectedPayment } from '@/common/screens/orders/checkout/confirmation/order-selected-payment';
import { OrderSelectedSchedule } from '@/common/screens/orders/checkout/confirmation/order-selected-schedule';
import { useBackWhenOrderExpires } from '@/common/screens/orders/checkout/useBackWhenOrderExpires';
import { ReviewP2POrder } from '@/common/screens/orders/p2p/review-p2p-order';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import crashlytics from '@react-native-firebase/crashlytics';
import { Stack, router, useNavigation } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

export default function OrderCheckoutDeliveryScreen() {
  // context
  const navigation = useNavigation();
  const api = useContextApi();
  const showToast = useShowToast();
  const quote = useContextOrder();
  const { paymentMethod, selectedCard } = useContextPayments();
  // state
  const issues = useCheckoutIssues();
  const placeOptions = usePlaceOrderOptions();
  // state
  const [loading, setLoading] = useState(false);
  // tracking
  useTrackScreenView('Checkout: pagamento', {
    businessId: quote?.business?.id,
    orderId: quote?.id,
  });
  useBackWhenOrderExpires(!loading);
  // handlers
  const canPlaceOrder = Boolean(placeOptions) && !issues.length;
  const placeOrder = () => {
    if (!placeOptions) return;
    setLoading(true);
    api
      .orders()
      .placeOrder(placeOptions)
      .then(() => {
        trackEvent('Pedido feito');
        console.log(placeOptions);
        router.navigate('/(logged)/(tabs)/(home)/');
        // @ts-ignore
        navigation.navigate('(orders)', {
          screen:
            '[orderId]/confirming' + (placeOptions.payment.payableWith === 'pix' ? '-pix' : ''),
          params: { orderId: placeOptions.orderId },
          initial: false,
        });
      })
      .catch((error) => {
        setLoading(false);
        if (error instanceof Error) {
          showToast(error.message, 'error');
          crashlytics().recordError(error);
        } else {
        }
      });
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
          />
        </DefaultView>
      </DefaultScrollView>
      <View style={{ flex: 1 }} />
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
            <DefaultButton title="Alterar pedido" variant="outline" onPress={() => null} />
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
            {issues.includes('profile-incomplete') ? (
              <DefaultButton title="Finalizar cadastro" onPress={completeProfileHandler} />
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}
