import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder } from '@/api/orders/context/order-context';
import { useContextPayments } from '@/api/orders/payment/context/payments-context';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HR } from '@/common/components/views/HR';
import { BusinessCartHeader } from '@/common/screens/home/businesses/checkout/business-cart-header';
import { CartButton } from '@/common/screens/home/businesses/detail/footer/cart-button';
import { OrderTotalBreakdown } from '@/common/screens/orders/breakdown/order-total-breakdown';
import { OrderPaymentMethod } from '@/common/screens/orders/checkout/payment/order-payment-method';
import { useBackWhenOrderExpires } from '@/common/screens/orders/checkout/useBackWhenOrderExpires';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Stack, router } from 'expo-router';
import { View } from 'react-native';

export default function OrderCheckoutDeliveryScreen() {
  // context
  const quote = useContextOrder();
  const orderId = quote?.id;
  const { paymentMethod, paymentMethodId } = useContextPayments();
  // tracking
  useTrackScreenView('Checkout: pagamento', {
    businessId: quote?.business?.id,
    orderId,
  });
  // side effects
  useBackWhenOrderExpires();
  console.log('r/[businessId]/checkout/payment', typeof quote, orderId);
  // UI
  if (!quote) return null;
  const disabled =
    !quote.fare || !paymentMethod || (paymentMethod === 'credit_card' && !paymentMethodId);
  return (
    <View style={{ ...screens.default }}>
      <DefaultScrollView>
        <Stack.Screen options={{ title: 'Pagamento' }} />
        <DefaultView style={{ padding: paddings.lg }}>
          <BusinessCartHeader business={quote.business} />
          {quote.type === 'food' ? <HR style={{ marginVertical: paddings.xl }} /> : null}
          <DefaultText size="lg">Resumo dos valores</DefaultText>
          <OrderTotalBreakdown style={{ marginTop: paddings.lg }} order={quote} />
          <HR style={{ marginVertical: paddings.xl }} />
          <DefaultText size="lg">Forma de pagamento</DefaultText>
          <OrderPaymentMethod
            onAddCard={() => {
              router.navigate({
                pathname: '/(logged)/checkout/[orderId]/cards/add',
                params: { orderId },
              });
            }}
          />
        </DefaultView>
      </DefaultScrollView>
      <View style={{ flex: 1 }} />
      <CartButton
        order={quote}
        variant="checkout"
        disabled={disabled}
        onPress={() =>
          router.navigate({
            pathname: '/(logged)/checkout/[orderId]/confirmation',
            params: { orderId },
          })
        }
      />
    </View>
  );
}
