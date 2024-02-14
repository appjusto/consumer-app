import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder } from '@/api/orders/context/order-context';
import { useContextPayments } from '@/api/orders/payment/context/payments-context';
import { AddCardScreenView } from '@/common/screens/orders/checkout/payment/cards/screen-add-card';
import screens from '@/common/styles/screens';
import { Stack, router } from 'expo-router';
import { View } from 'react-native';

export default function CheckoutAddCardScreen() {
  // context
  const quote = useContextOrder();
  const { setPaymentMethod, setPaymentMethodId } = useContextPayments();
  // tracking
  useTrackScreenView('Checkout: adicionar cartão', {
    businessId: quote?.business?.id,
    orderId: quote?.id,
  });
  // handlers
  const completeHandler = (cardId: string) => {
    setPaymentMethod!('credit_card');
    setPaymentMethodId!(cardId);

    router.navigate({
      pathname: '/(logged)/checkout/[orderId]/payment',
      params: { orderId: quote?.id },
    });
  };
  // UI
  return (
    <View style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Adicionar cartão' }} />
      <AddCardScreenView onComplete={completeHandler} />
    </View>
  );
}
