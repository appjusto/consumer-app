import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder } from '@/api/orders/context/order-context';
import { useContextProfile } from '@/common/auth/AuthContext';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { isProfileValid } from '@/common/profile/isProfileValid';
import ProfilePersonalData from '@/common/screens/profile/personal';
import screens from '@/common/styles/screens';
import { Stack, router } from 'expo-router';

export default function ProfilePersonalDataScreen() {
  // context
  const quote = useContextOrder();
  const profile = useContextProfile();
  const profileValid = isProfileValid(profile);
  // tracking
  useTrackScreenView('Checkout: perfil', {
    businessId: quote?.business?.id,
    orderId: quote?.id,
    profileValid,
  });
  // handlers
  const nextHandler = () => {
    if (!quote?.id) return;
    router.navigate({
      pathname: '/(logged)/checkout/[orderId]/delivery',
      params: { orderId: quote.id },
    });
  };
  // UI
  return (
    <DefaultView style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Dados pessoais' }} />
      <ProfilePersonalData onUpdateProfile={nextHandler} />
    </DefaultView>
  );
}
