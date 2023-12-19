import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrderQuote } from '@/api/orders/context/order-context';
import { usePlaceOrderOptions } from '@/api/orders/payment/usePlaceOrderOptions';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HR } from '@/common/components/views/HR';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { OrderSelectedDestination } from '@/common/screens/orders/checkout/confirmation/order-selected-destination';
import { OrderSelectedPayment } from '@/common/screens/orders/checkout/confirmation/order-selected-payment';
import { OrderSelectedSchedule } from '@/common/screens/orders/checkout/confirmation/order-selected-schedule';
import { useBackWhenOrderExpires } from '@/common/screens/orders/checkout/useBackWhenOrderExpires';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import crashlytics from '@react-native-firebase/crashlytics';
import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function OrderCheckoutDeliveryScreen() {
  // params
  const params = useLocalSearchParams<{ id: string }>();
  const businessId = params.id;
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  const quote = useContextOrderQuote();
  // tracking
  useTrackScreenView('Checkout: pagamento', { businessId });
  // side effects
  useBackWhenOrderExpires();
  const options = usePlaceOrderOptions();
  // handlers
  const canPlaceOrder = Boolean(options);
  const placeOrder = () => {
    if (!options) return;
    // TODO: loading
    api
      .orders()
      .placeOrder(options)
      .then(() => {
        // TODO: next screen
      })
      .catch((error) => {
        console.error(error);
        if (error instanceof Error) {
          showToast(error.message, 'error');
          crashlytics().recordError(error);
        } else {
        }
      });
  };
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
          <OrderSelectedPayment style={{ marginTop: paddings.lg }} />
        </DefaultView>
      </DefaultScrollView>
      <View style={{ flex: 1 }} />
      <View>
        <HR
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3,
          }}
        />
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
              disabled={!canPlaceOrder}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
