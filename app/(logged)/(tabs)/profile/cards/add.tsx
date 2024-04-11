import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { AddCardScreenView } from '@/common/screens/orders/checkout/payment/cards/screen-add-card';
import screens from '@/common/styles/screens';
import { Stack, router } from 'expo-router';
import { View } from 'react-native';

export default function CheckoutAddCardScreen() {
  // tracking
  useTrackScreenView('Perfil: adicionar cartão');
  // handlers
  const completeHandler = (cardId: string) => {
    router.back();
  };
  // UI
  return (
    <View style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Adicionar cartão' }} />
      <AddCardScreenView onComplete={completeHandler} />
    </View>
  );
}
