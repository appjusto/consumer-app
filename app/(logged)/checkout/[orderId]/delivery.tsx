import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useCheckoutIssues } from '@/api/orders/checkout/useCheckoutIssues';
import { useContextOrder } from '@/api/orders/context/order-context';
import { DefaultKeyboardAwareScrollView } from '@/common/components/containers/DefaultKeyboardAwareScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { DeliveryAddress } from '@/common/screens/home/businesses/checkout/delivery/delivery-address';
import { FulfillmentSelector } from '@/common/screens/home/businesses/checkout/delivery/fulfillment-selector';
import { OrderFleetCourierSelector } from '@/common/screens/home/businesses/checkout/delivery/order-fleet-courier-selector';
import { PreparationMode } from '@/common/screens/home/businesses/checkout/delivery/preparation-mode';
import { CartButton } from '@/common/screens/home/businesses/detail/footer/cart-button';
import { useUpdateOrderDestination } from '@/common/screens/orders/checkout/places/useUpdateOrderDestination';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Stack, router } from 'expo-router';
import { View } from 'react-native';

export default function OrderCheckoutDeliveryScreen() {
  // context
  const quote = useContextOrder();
  // state
  const issues = useCheckoutIssues();
  // tracking
  useTrackScreenView('Checkout: entrega', { businessId: quote?.business?.id, orderId: quote?.id });
  // side effects
  useUpdateOrderDestination();
  // useBackWhenOrderExpires();
  // handlers
  const checkoutHandler = () => {
    if (!quote) return;
    router.navigate({
      pathname: '/(logged)/checkout/[orderId]/payment',
      params: { orderId: quote.id },
    });
  };
  // logs
  console.log('checkout/[orderId]/delivery', typeof quote, quote?.id);
  // UI
  if (!quote) return null;
  return (
    <View style={{ ...screens.default }}>
      <DefaultKeyboardAwareScrollView>
        <Stack.Screen options={{ title: 'Entrega' }} />
        <DefaultView style={{ padding: paddings.lg }}>
          <FulfillmentSelector order={quote} />
          <DeliveryAddress style={{ marginTop: paddings.xl }} order={quote} />
          <PreparationMode style={{ marginTop: paddings.xl }} order={quote} />
          <OrderFleetCourierSelector style={{ marginTop: paddings.xl }} />
        </DefaultView>
      </DefaultKeyboardAwareScrollView>
      <View style={{ flex: 1 }} />
      <CartButton
        order={quote}
        variant="checkout"
        disabled={!quote.fare || Boolean(quote.route?.issue) || Boolean(issues.length)}
        onPress={checkoutHandler}
      />
    </View>
  );
}
