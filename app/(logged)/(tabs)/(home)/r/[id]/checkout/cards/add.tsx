import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrderPayments } from '@/api/orders/context/order-context';
import { AddCardScreenView } from '@/common/screens/orders/checkout/payment/cards/screen-add-card';
import screens from '@/common/styles/screens';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function CheckoutAddCardScreen() {
  // params
  const params = useLocalSearchParams<{ id: string }>();
  const businessId = params.id;
  // context
  const { setPaymentMethod, setPaymentMethodId } = useContextOrderPayments();
  // tracking
  useTrackScreenView('Checkout: adicionar cartão');
  // handlers
  const completeHandler = (cardId: string) => {
    setPaymentMethod!('credit_card');
    setPaymentMethodId!(cardId);

    router.push({
      pathname: '/(logged)/(tabs)/(home)/r/[id]/checkout/payment',
      params: { id: businessId },
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
