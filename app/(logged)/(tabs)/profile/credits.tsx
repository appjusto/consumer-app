import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { DefaultText } from '@/common/components/texts/DefaultText';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function ProfileCreditsScreen() {
  // tracking
  useTrackScreenView('Sua conta: créditos');
  // UI
  return (
    <DefaultView style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Seus créditos' }} />
      <View style={{ padding: paddings.lg }}>
        <DefaultText size="xl" style={{ marginVertical: 0 }}>
          Como funciona?
        </DefaultText>
        <DefaultText size="md" style={{ marginTop: paddings.sm }}>
          Você
        </DefaultText>
      </View>
    </DefaultView>
  );
}
