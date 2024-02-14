import { useContextApi } from '@/api/ApiContext';
import { trackEvent } from '@/api/analytics/track';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
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
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import crashlytics from '@react-native-firebase/crashlytics';
import { Stack, router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

export default function OrderCheckoutDeliveryScreen() {
  // params
  const params = useLocalSearchParams<{ businessId: string }>();
  const businessId = params.businessId;
  // context
  const navigation = useNavigation();
  const api = useContextApi();
  const showToast = useShowToast();
  const quote = useContextOrder();
  const { paymentMethod, selectedCard } = useContextPayments();
  // state
  const [loading, setLoading] = useState(false);
  // tracking
  useTrackScreenView('Checkout: pagamento', { businessId, orderId: quote?.id });
  // side effects
  useBackWhenOrderExpires(!loading);
  const options = usePlaceOrderOptions();
  // handlers
  const canPlaceOrder = Boolean(options);
  const placeOrder = () => {
    if (!options) return;
    setLoading(true);
    api
      .orders()
      .placeOrder(options)
      .then(() => {
        trackEvent('Pedido feito');
        router.navigate('/(logged)/(tabs)/(home)/');
        // @ts-ignore
        navigation.navigate('(orders)', {
          screen: '[id]/confirming',
          params: { id: options.orderId },
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
  console.log('r/[id]/checkout/confirmation', typeof quote, quote?.id);
  // UI
  if (!quote) return null;
  const deliveryOrTakeAway = quote.fulfillment === 'delivery' ? 'Entrega' : 'Retirada';
  console.log(options);
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
