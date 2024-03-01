import { useContextApi } from '@/api/ApiContext';
import { trackEvent } from '@/api/analytics/track';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder, useContextPlaceOrderOptions } from '@/api/orders/context/order-context';
import { useContextPayments } from '@/api/orders/payment/context/payments-context';
import { getOrderStage } from '@/api/orders/status';
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
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import crashlytics from '@react-native-firebase/crashlytics';
import { Stack, router, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

export default function OrderCheckoutDeliveryScreen() {
  // context
  const navigation = useNavigation();
  const api = useContextApi();
  const showToast = useShowToast();
  const quote = useContextOrder();
  const orderId = quote?.id;
  const status = quote?.status;
  const type = quote?.type;
  const { paymentMethod, selectedCard } = useContextPayments();
  const placeOptions = useContextPlaceOrderOptions();
  // state
  const [loading, setLoading] = useState(false);
  // tracking
  useTrackScreenView('Checkout: pagamento', {
    businessId: quote?.business?.id,
    orderId: quote?.id,
  });
  // side effects
  useEffect(() => {
    if (!status) return;
    if (!type) return;
    const stage = getOrderStage(status, type);
    if (stage === 'placing') {
    }
  }, [navigation, orderId, status, type]);
  useBackWhenOrderExpires(!loading);
  // handlers
  const canPlaceOrder = Boolean(placeOptions);
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
          screen: '[orderId]/confirming',
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
  console.log('checkout/[orderId]/confirmation', typeof quote, quote?.id);
  // UI
  if (!quote) return null;
  const deliveryOrTakeAway = quote.fulfillment === 'delivery' ? 'Entrega' : 'Retirada';
  console.log(placeOptions);
  return (
    <View style={{ ...screens.default }}>
      <DefaultScrollView>
        <Stack.Screen options={{ title: 'Confirme seu pedido' }} />
        <DefaultView style={{ padding: paddings.lg }}>
          <DefaultText size="lg">{deliveryOrTakeAway}</DefaultText>
          <OrderSelectedSchedule style={{ marginTop: paddings.lg }} />
          <DefaultText style={{ marginTop: paddings.lg }} size="lg">
            {`Endereço de ${deliveryOrTakeAway}`}
          </DefaultText>
          <OrderSelectedDestination style={{ marginTop: paddings.lg }} />
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
            <DefaultButton
              title="Confirmar pedido"
              onPress={placeOrder}
              disabled={!canPlaceOrder || loading}
              loading={loading}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
