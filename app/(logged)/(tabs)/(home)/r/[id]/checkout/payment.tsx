import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrderQuote } from '@/api/orders/context/order-provider';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HR } from '@/common/components/views/HR';
import { BusinessCartHeader } from '@/common/screens/home/businesses/checkout/business-cart-header';
import { CartButton } from '@/common/screens/home/businesses/detail/footer/cart-button';
import { OrderTotalBreakdown } from '@/common/screens/orders/breakdown/order-total-breakdown';
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
        <Stack.Screen options={{ title: 'Pagamento' }} />
        <DefaultView style={{ padding: paddings.lg }}>
          <BusinessCartHeader business={quote.business} />
          <HR style={{ marginVertical: paddings.xl }} />
          <DefaultText size="lg">Resumo dos valores</DefaultText>
          <OrderTotalBreakdown style={{ marginTop: paddings.lg }} order={quote} />
          <HR style={{ marginVertical: paddings.xl }} />
          <DefaultText size="lg">Forma de pagamento</DefaultText>
        </DefaultView>
      </DefaultScrollView>
      <View style={{ flex: 1 }} />
      <CartButton
        variant="checkout"
        onPress={() =>
          router.push({
            pathname: '/(logged)/(tabs)/(home)/r/[id]/checkout/delivery',
            params: { id: businessId },
          })
        }
      />
    </View>
  );
}
