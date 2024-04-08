import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder } from '@/api/orders/context/order-context';
import { DefaultView } from '@/common/components/containers/DefaultView';
import ProfilePersonalData from '@/common/screens/profile/personal';
import screens from '@/common/styles/screens';
import { Stack, router } from 'expo-router';

export default function ProfilePersonalDataScreen() {
  // context
  const quote = useContextOrder();
  // tracking
  useTrackScreenView('Checkout: perfil', {
    businessId: quote?.business?.id,
    orderId: quote?.id,
  });
  // UI
  return (
    <DefaultView style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Dados pessoais' }} />
      <ProfilePersonalData onUpdateProfile={() => router.back()} />
    </DefaultView>
  );
}
