import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { DefaultText } from '@/common/components/texts/DefaultText';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';

export default function DeliveriesIndex() {
  useTrackScreenView('Pedidos');
  // UI
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <DefaultView style={{ ...screens.headless, padding: paddings.lg }}>
        <DefaultText>Pedidos</DefaultText>
      </DefaultView>
    </DefaultScrollView>
  );
}
