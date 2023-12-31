import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrderPayments, useContextOrderQuote } from '@/api/orders/context/order-context';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HR } from '@/common/components/views/HR';
import { BusinessCartHeader } from '@/common/screens/home/businesses/checkout/business-cart-header';
import { CartButton } from '@/common/screens/home/businesses/detail/footer/cart-button';
import { OrderTotalBreakdown } from '@/common/screens/orders/breakdown/order-total-breakdown';
import { OrderPaymentMethod } from '@/common/screens/orders/checkout/payment/order-payment-method';
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
  const { paymentMethod, paymentMethodId } = useContextOrderPayments();
  // tracking
  useTrackScreenView('Checkout: pagamento', { businessId, orderId: quote?.id });
  // side effects
  // useBackWhenOrderExpires();
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
          <HR style={{ marginVertical: paddings.xl }} />
          <DefaultText size="lg">Resumo dos valores</DefaultText>
          <OrderTotalBreakdown style={{ marginTop: paddings.lg }} order={quote} />
          <HR style={{ marginVertical: paddings.xl }} />
          <DefaultText size="lg">Forma de pagamento</DefaultText>
          <OrderPaymentMethod
            onAddCard={() => {
              router.push({
                pathname: '/(logged)/(tabs)/(home)/r/[id]/checkout/cards/add',
                params: { id: businessId },
              });
            }}
          />
        </DefaultView>
      </DefaultScrollView>
      <View style={{ flex: 1 }} />
      <CartButton
        variant="checkout"
        disabled={disabled}
        onPress={() =>
          router.push({
            pathname: '/(logged)/(tabs)/(home)/r/[id]/checkout/confirmation',
            params: { id: businessId },
          })
        }
      />
    </View>
  );
}
