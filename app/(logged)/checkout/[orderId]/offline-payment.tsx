import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder } from '@/api/orders/context/order-context';
import { useContextPayments } from '@/api/orders/payment/context/payments-context';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { PaymentMethod } from '@/common/screens/orders/checkout/payment/payment-method';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Stack, router } from 'expo-router';
import { CreditCard } from 'lucide-react-native';
import { View } from 'react-native';

export default function OrderCheckoutOfflinePaymentScreen() {
  // context
  const api = useContextApi();
  const quote = useContextOrder();
  const orderId = quote?.id;
  const { paymentMethod, setPaymentMethod } = useContextPayments();
  // state
  // tracking
  useTrackScreenView('Checkout: pagamento na entrega', {
    businessId: quote?.business?.id,
    orderId,
  });
  // handlers
  const updatePaymentMethodHandler = () => {
    router.back();
  };
  // UI
  if (!setPaymentMethod) return;
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Pagamento na entrega' }} />
      <DefaultView style={{ flex: 1, padding: paddings.lg }}>
        <PaymentMethod
          title="Cartão de crédito"
          checked={paymentMethod === 'business-credit-card'}
          icon={
            <View
              style={{
                borderRadius: 4,
                borderColor: colors.neutral100,
                borderWidth: 1,
                paddingHorizontal: paddings.md,
                paddingVertical: paddings.xs,
                backgroundColor: colors.white,
              }}
            >
              <CreditCard size={16} color={colors.neutral800} />
            </View>
          }
          onPress={() => setPaymentMethod('business-credit-card')}
        />
        <PaymentMethod
          style={{ marginTop: paddings.lg }}
          title="Cartão de débito"
          checked={paymentMethod === 'business-debit-card'}
          icon={
            <View
              style={{
                borderRadius: 4,
                borderColor: colors.neutral100,
                borderWidth: 1,
                paddingHorizontal: paddings.md,
                paddingVertical: paddings.xs,
                backgroundColor: colors.white,
              }}
            >
              <CreditCard size={16} color={colors.neutral800} />
            </View>
          }
          onPress={() => setPaymentMethod('business-debit-card')}
        />
        <View style={{ flex: 1 }} />
        <DefaultButton
          style={{ marginVertical: paddings.lgg }}
          title="Confirmar"
          onPress={updatePaymentMethodHandler}
        ></DefaultButton>
      </DefaultView>
    </DefaultScrollView>
  );
}
