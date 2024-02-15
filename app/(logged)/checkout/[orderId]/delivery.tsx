import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder } from '@/api/orders/context/order-context';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { DeliveryAddress } from '@/common/screens/home/businesses/checkout/delivery/delivery-address';
import { FulfillmentSelector } from '@/common/screens/home/businesses/checkout/delivery/fulfillment-selector';
import { OrderFleetSelector } from '@/common/screens/home/businesses/checkout/delivery/order-fleet-selector';
import { PreparationMode } from '@/common/screens/home/businesses/checkout/delivery/preparation-mode';
import { CartButton } from '@/common/screens/home/businesses/detail/footer/cart-button';
import { useUpdateOrderDestination } from '@/common/screens/orders/checkout/places/useUpdateOrderDestination';
import { useBackWhenOrderExpires } from '@/common/screens/orders/checkout/useBackWhenOrderExpires';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Stack, router } from 'expo-router';
import { View } from 'react-native';

export default function OrderCheckoutDeliveryScreen() {
  // context
  const quote = useContextOrder();
  // const { loading } = useContextOrderFares();
  // tracking
  useTrackScreenView('Checkout: entrega', { businessId: quote?.business?.id, orderId: quote?.id });
  // side effects
  useUpdateOrderDestination(quote?.id);
  useBackWhenOrderExpires();
  console.log('r/[businessId]/checkout/delivery', typeof quote, quote?.id);
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
          router.navigate({
            pathname: '/(logged)/checkout/[orderId]/payment',
            params: { orderId: quote.id },
          })
        }
      />
    </View>
  );
}
