import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder, useContextOrderOptions } from '@/api/orders/context/order-context';
import { useContextPayments } from '@/api/orders/payment/context/payments-context';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { PatternInput } from '@/common/components/inputs/pattern/PatternInput';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { PaymentMethod } from '@/common/screens/orders/checkout/payment/payment-method';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Stack, router } from 'expo-router';
import { toNumber } from 'lodash';
import { Banknote, CreditCard } from 'lucide-react-native';
import { View } from 'react-native';

export default function OrderCheckoutOfflinePaymentScreen() {
  // context
  const quote = useContextOrder();
  const orderId = quote?.id;
  const { paymentMethod, setPaymentMethod, acceptedOnOrder } = useContextPayments();
  const { change, setChange } = useContextOrderOptions() ?? {};
  // tracking
  useTrackScreenView('Checkout: pagamento na entrega', {
    businessId: quote?.business?.id,
    orderId,
  });
  // handlers
  const updatePaymentMethodHandler = () => {
    router.back();
  };
  console.log(change);
  // UI
  if (!setPaymentMethod) return;
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Pagamento na entrega' }} />
      <DefaultView style={{ flex: 1, padding: paddings.lg }}>
        {acceptedOnOrder?.includes('business-credit-card') ? (
          <PaymentMethod
            style={{ marginBottom: paddings.lg }}
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
        ) : null}
        {acceptedOnOrder?.includes('business-debit-card') ? (
          <PaymentMethod
            style={{ marginBottom: paddings.lg }}
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
        ) : null}
        {acceptedOnOrder?.includes('cash') ? (
          <PaymentMethod
            style={{ marginBottom: paddings.lg }}
            title="Dinheiro"
            checked={paymentMethod === 'cash'}
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
                <Banknote size={16} color={colors.neutral800} />
              </View>
            }
            onPress={() => setPaymentMethod('cash')}
          >
            <DefaultText style={{ marginTop: paddings.xl }} color="black">
              Vai precisar de troco?
            </DefaultText>
            <DefaultText style={{ marginTop: paddings.sm }} color="neutral800">
              Digite o valor que você vai pagar em dinheiro para quem for entregar seu pedido possa
              levar o troco para você.
            </DefaultText>
            <PatternInput
              style={{ marginTop: paddings.lg }}
              pattern="currency"
              value={change}
              onChangeText={setChange}
            />
          </PaymentMethod>
        ) : null}
        <View style={{ flex: 1 }} />
        <DefaultButton
          style={{ marginVertical: paddings.lgg }}
          title="Confirmar"
          disabled={paymentMethod === 'cash' && !toNumber(change)}
          onPress={updatePaymentMethodHandler}
        ></DefaultButton>
      </DefaultView>
    </DefaultScrollView>
  );
}
