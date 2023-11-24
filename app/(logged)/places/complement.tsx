import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextTemporaryPlace } from '@/api/preferences/context/PreferencesContext';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Stack } from 'expo-router';

export default function NewPlaceComplementScreen() {
  // context
  const temporaryPlace = useContextTemporaryPlace();
  // tracking
  useTrackScreenView('');
  // UI
  console.log(temporaryPlace);
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Complement' }} />
      <DefaultView style={{ padding: paddings.lg }}></DefaultView>
    </DefaultScrollView>
  );
}
