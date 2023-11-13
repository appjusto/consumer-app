import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useObserveOrdersOfLast24h } from '@/api/orders/useObserveOrdersOfLast24h';
import { useOrdersSummary } from '@/api/orders/useOrdersSummary';
import { useContextAvailabilityModal } from '@/api/preferences/context/PreferencesContext';
import { useContextProfile } from '@/common/auth/AuthContext';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import DefaultCard from '@/common/components/views/cards/DefaultCard';
import { DefaultCardIcon } from '@/common/components/views/cards/icon';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

export default function HomeScreen() {
  // context
  const api = useContextApi();
  const profile = useContextProfile();
  const router = useRouter();
  // tracking
  useTrackScreenView('Início');
  // state
  // const entriesSummary = useApprovedEntriesSummary();
  const orders = useObserveOrdersOfLast24h();
  const ordersSummary = useOrdersSummary(orders);
  const { availabilityModalShown, setAvailabilityModalShown } = useContextAvailabilityModal();
  const [supportModalShown, setSupportModalShown] = useState(false);
  // handlers
  // UI
  return (
    <View style={{ ...screens.default }}>
      <DefaultView style={screens.headless}>
        <DefaultScrollView>
          <View style={{ padding: paddings.lg }}></View>
          <View
            style={{
              flex: 1,
              paddingVertical: paddings.sm,
              paddingHorizontal: paddings.lg,
              backgroundColor: colors.neutral50,
            }}
          >
            <Pressable onPress={() => router.push('/(logged)/howitworks')}>
              <DefaultCard
                icon={<DefaultCardIcon iconName="file" />}
                title="Como funciona o AppJusto"
                subtitle="Conheça as vantagens e entenda os benefícios que temos para você"
              />
            </Pressable>
            <Pressable onPress={() => router.push('/calculator/')}>
              <DefaultCard
                style={{ marginTop: paddings.sm }}
                icon={<DefaultCardIcon iconName="file" />}
                title="Calculadora de ganhos"
                subtitle="Calcule seus ganhos por corrida e por hora"
              />
            </Pressable>
            <Pressable onPress={() => setSupportModalShown(true)}>
              <DefaultCard
                style={{ marginTop: paddings.sm }}
                icon={<DefaultCardIcon iconName="alert" variant="warning" />}
                title="Preciso de ajuda"
                subtitle="Fale com nosso time ou faça uma denúncia"
              />
            </Pressable>
          </View>
        </DefaultScrollView>
      </DefaultView>
    </View>
  );
}
