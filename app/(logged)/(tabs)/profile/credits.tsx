import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { totalApproved } from '@/api/ledger/totalApproved';
import { useObserveEntries } from '@/api/ledger/useObserveEntries';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { CreditEntry } from '@/common/screens/profile/credits/credit-entry';
import { CreditsApprovedSummary } from '@/common/screens/profile/credits/credits-approved-summary';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { ProfileCode } from '../../../../common/screens/profile/credits/profile-code';

export default function ProfileCreditsScreen() {
  // state
  const entries = useObserveEntries();
  const total = totalApproved(entries);
  // tracking
  useTrackScreenView('Sua conta: créditos');
  // UI
  return (
    <DefaultScrollView style={{ ...screens.default, backgroundColor: colors.neutral50 }}>
      <Stack.Screen options={{ title: 'Seus créditos' }} />
      <View style={{ padding: paddings.lg }}>
        <DefaultText size="xl" style={{ marginVertical: 0 }}>
          Meus créditos
        </DefaultText>
        <DefaultText size="md" style={{ marginTop: paddings.sm }}>
          Compartilhe seu código e ganhe R$ 5 para cada pessoa que fizer um pedido pela primeira vez
          no appjusto.
        </DefaultText>
        <ProfileCode />
        <CreditsApprovedSummary style={{ marginTop: paddings.lg }} total={total} />
        {/* history */}
        {entries?.length ? (
          <View style={{ marginTop: paddings['2xl'] }}>
            <DefaultText size="md">Histórico de créditos</DefaultText>
            {entries.map((entry) => (
              <CreditEntry style={{ marginTop: paddings.lg }} key={entry.id} entry={entry} />
            ))}
          </View>
        ) : null}
      </View>
    </DefaultScrollView>
  );
}
