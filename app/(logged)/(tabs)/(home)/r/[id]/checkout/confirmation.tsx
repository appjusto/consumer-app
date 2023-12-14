import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrderQuote } from '@/api/orders/context/order-context';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HR } from '@/common/components/views/HR';
import { OrderSelectedDestination } from '@/common/screens/orders/checkout/confirmation/order-selected-destination';
import { OrderSelectedPayment } from '@/common/screens/orders/checkout/confirmation/order-selected-payment';
import { OrderSelectedSchedule } from '@/common/screens/orders/checkout/confirmation/order-selected-schedule';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function OrderCheckoutDeliveryScreen() {
  // params
  const params = useLocalSearchParams<{ id: string }>();
  const businessId = params.id;
  // context
  const quote = useContextOrderQuote();
  // tracking
  useTrackScreenView('Checkout: pagamento', { businessId });
  // side effects
  // go back when order becomes empty
  useEffect(() => {
    if (quote === null) router.replace('/(logged)/(tabs)/(home)/');
  }, [quote]);
  // UI
  if (!quote) return null;
  return (
    <View style={{ ...screens.default }}>
      <DefaultScrollView>
        <Stack.Screen options={{ title: 'Confirme seu pedido' }} />
        <DefaultView style={{ padding: paddings.lg }}>
          <DefaultText size="lg">Entrega</DefaultText>
          <OrderSelectedSchedule style={{ marginTop: paddings.lg }} />
          <DefaultText style={{ marginTop: paddings.lg }} size="lg">
            Endereço de entrega
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
            <DefaultButton title="Confirmar pedido" onPress={() => null} />
          </View>
        </View>
      </View>
    </View>
  );
}
