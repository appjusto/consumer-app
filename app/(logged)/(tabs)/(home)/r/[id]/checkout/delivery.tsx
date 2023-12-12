import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { DefaultText } from '@/common/components/texts/DefaultText';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Stack } from 'expo-router';

export default function Screen() {
  // tracking
  useTrackScreenView('Checkout: entrega');
  // UI
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Entrega' }} />
      <DefaultView style={{ padding: paddings.lg }}>
        <DefaultText>Entrega</DefaultText>
      </DefaultView>
    </DefaultScrollView>
  );
}
