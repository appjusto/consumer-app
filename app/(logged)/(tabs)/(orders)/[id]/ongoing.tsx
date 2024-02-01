import { DefaultView } from '@/common/components/containers/DefaultView';
import { OngoingOrderScreenView } from '@/common/screens/orders/ongoing/ongoing-order-screen';
import screens from '@/common/styles/screens';
import { useLocalSearchParams } from 'expo-router';

export default function OngoingOrderScreen() {
  // params
  const params = useLocalSearchParams<{ id: string }>();
  const orderId = params.id;
  // UI
  return (
    <DefaultView style={{ ...screens.default }}>
      <OngoingOrderScreenView orderId={orderId} />
    </DefaultView>
  );
}
