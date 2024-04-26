import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useObserveFleet } from '@/api/fleets/useObserveFleet';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { getAppjustoDomain } from '@/common/constants/urls';
import { FleetDetail } from '@/common/screens/fleets/fleet-detail';
import { ScreenTitle } from '@/common/screens/title/screen-title';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import * as Clipboard from 'expo-clipboard';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Share2 } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

export default function FleetDetailScreen() {
  // params
  const params = useLocalSearchParams<{ fleetId: string }>();
  // context
  const showToast = useShowToast();
  // state
  const fleet = useObserveFleet(params.fleetId);
  // tracking
  useTrackScreenView('Frota', { fleetName: fleet?.name }, Boolean(fleet));
  // handlers
  const copyToClipboard = () => {
    if (!fleet) return;
    Clipboard.setStringAsync(`https://${getAppjustoDomain()}/fleets/${fleet.id}`).then(() => {
      showToast('Link da frota copiado!', 'success');
    });
  };
  // UI
  if (!fleet) return <ScreenTitle title="Detalhe da frota" loading />;
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <Stack.Screen
        options={{
          title: `Frota ${fleet.name}`,
          headerRight: (props) => (
            <Pressable onPress={copyToClipboard}>
              {() => <Share2 size={16} color={colors.neutral900} />}
            </Pressable>
          ),
        }}
      />
      <View style={{ padding: paddings.lg }}>
        {/* header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {/* title */}
          <View>
            <DefaultText size="md">{fleet.name}</DefaultText>
            <DefaultText
              size="xs"
              color="success500"
              style={{ marginTop: paddings.xs }}
            >{`${fleet.participantsOnline} participantes online`}</DefaultText>
          </View>
        </View>

        {/* description */}
        <DefaultText size="xs" style={{ marginTop: paddings.lg }}>
          {fleet.description}
        </DefaultText>
      </View>
      <FleetDetail fleet={fleet} />
    </DefaultScrollView>
  );
}
