import { DefaultView } from '@/common/components/containers/DefaultView';
import { OngoingOrderScreenView } from '@/common/screens/orders/ongoing/ongoing-order-screen';
import screens from '@/common/styles/screens';

export default function OngoingOrderScreen() {
  // UI
  return (
    <DefaultView style={{ ...screens.default }}>
      <OngoingOrderScreenView />
    </DefaultView>
  );
}
