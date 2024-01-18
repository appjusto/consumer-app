import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrderQuote } from '@/api/orders/context/order-context';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { DeliveryAddress } from '@/common/screens/home/businesses/checkout/delivery/delivery-address';
import { FulfillmentSelector } from '@/common/screens/home/businesses/checkout/delivery/fulfillment-selector';
import { OrderFleetSelector } from '@/common/screens/home/businesses/checkout/delivery/order-fleet-selector';
import { PreparationMode } from '@/common/screens/home/businesses/checkout/delivery/preparation-mode';
import { CartButton } from '@/common/screens/home/businesses/detail/footer/cart-button';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function OrderCheckoutDeliveryScreen() {
  // params
  const params = useLocalSearchParams<{ id: string }>();
  const businessId = params.id;
  // context
  const quote = useContextOrderQuote();
  // tracking
  useTrackScreenView('Checkout: entrega', { businessId, orderId: quote?.id });
  // side effects
  // useBackWhenOrderExpires();
  // UI
  if (!quote) return null;
  return (
    <View style={{ ...screens.default }}>
      <DefaultScrollView>
        <Stack.Screen options={{ title: 'Entrega' }} />
        <DefaultView style={{ padding: paddings.lg }}>
          <FulfillmentSelector order={quote} />
          <DeliveryAddress style={{ marginTop: paddings.xl }} order={quote} />
          <PreparationMode style={{ marginTop: paddings.xl }} order={quote} />
          <OrderFleetSelector style={{ marginTop: paddings.xl }} order={quote} />
        </DefaultView>
      </DefaultScrollView>
      <View style={{ flex: 1 }} />
      <CartButton
        order={quote}
        variant="checkout"
        disabled={!quote.fare}
        onPress={() =>
          router.push({
            pathname: '/(logged)/(tabs)/(home)/r/[id]/checkout/payment',
            params: { id: businessId },
          })
        }
      />
    </View>
  );
}
