import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { checkoutHasIssue } from '@/api/orders/checkout/checkoutHasIssue';
import { useCheckoutIssues } from '@/api/orders/checkout/useCheckoutIssues';
import { useContextOrder } from '@/api/orders/context/order-context';
import { useContextPayments } from '@/api/orders/payment/context/payments-context';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HR } from '@/common/components/views/HR';
import { MessageBox } from '@/common/components/views/MessageBox';
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
  // state
  const issues = useCheckoutIssues(false, true);
  // tracking
  useTrackScreenView('Checkout: pagamento', {
    businessId: quote?.business?.id,
    orderId,
  });
  // side effects
  useBackWhenOrderExpires();
  // handlers
  const completeProfileHandler = () => {
    if (!quote) return;
    router.navigate({
      pathname: '/(logged)/checkout/[orderId]/profile',
      params: { orderId: quote.id },
    });
  };
  // logs
  console.log(
    'r/[businessId]/checkout/payment',
    typeof quote,
    orderId,
    paymentMethod,
    paymentMethodId
  );
  // UI
  if (!quote) return null;
  const disabled =
    !quote.fare ||
    !paymentMethod ||
    (paymentMethod === 'credit_card' && !paymentMethodId) ||
    checkoutHasIssue(issues, 'profile-incomplete');
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
          {issues.length ? (
            <MessageBox variant="warning" style={{ margin: paddings.lg, marginTop: 0 }}>
              {issues[0].description}
            </MessageBox>
          ) : (
            <View>
              <DefaultText size="lg">Forma de pagamento</DefaultText>
              <OrderPaymentMethod
                onAddCard={() => {
                  router.navigate({
                    pathname: '/(logged)/checkout/[orderId]/cards/add',
                    params: { orderId },
                  });
                }}
              />
            </View>
          )}
        </DefaultView>
      </DefaultScrollView>
      <View style={{ flex: 1 }} />
      <CartButton
        order={quote}
        variant="total-order"
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
