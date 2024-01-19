import { useContextApi } from '@/api/ApiContext';
import { trackEvent } from '@/api/analytics/track';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useObserveBusiness } from '@/api/business/useObserveBusiness';
import { issueTypeForOrder } from '@/api/incidents/issueTypeForOrder';
import { useObserveOrder } from '@/api/orders/useObserveOrder';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { Loading } from '@/common/components/views/Loading';
import DefaultCard from '@/common/components/views/cards/DefaultCard';
import { DefaultCardIcon } from '@/common/components/views/cards/icon';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { SelectIssueModal } from '@/common/screens/incident/select-issue-modal';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Issue } from '@appjusto/types';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, View } from 'react-native';

export default function IncidentScreen() {
  // params
  const params = useLocalSearchParams<{ id: string }>();
  const orderId = params.id;
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  // state
  const order = useObserveOrder(orderId);
  const issueType = issueTypeForOrder(order);
  const business = useObserveBusiness(order?.business?.id);
  const phone = business?.phones?.find(({ type }) => type === 'desk')?.number;
  const [loading, setLoading] = useState(false);
  const [reportIssueModalShown, setReportIssueModalShown] = useState(false);
  // tracking
  useTrackScreenView('Ajuda com pedido', { orderId });
  // handlers
  const createIncident = (issue: Issue, comment: string) => {
    trackEvent('Relatou problema');
    setLoading(true);
    api
      .incidents()
      .createIncident(issue, comment, orderId)
      .catch((error: unknown) => {
        if (error instanceof Error) showToast(error.message, 'error');
      })
      .finally(() => {
        setReportIssueModalShown(false);
        setLoading(false);
      });
  };
  // UI
  if (!order || !issueType) return <Loading backgroundColor="neutral50" />;
  return (
    <DefaultScrollView style={{ ...screens.default, backgroundColor: colors.neutral50 }}>
      <Stack.Screen options={{ title: 'Ajuda' }} />
      <SelectIssueModal
        title="Qual o problema que você quer relatar?"
        issueType={issueType}
        visible={reportIssueModalShown}
        onConfirm={createIncident}
        loading={loading}
        onDismiss={() => setReportIssueModalShown(false)}
      />
      <View style={{ flex: 1, padding: paddings.lg }}>
        {phone ? (
          <Pressable onPress={() => Linking.openURL(`tel:${phone}`)}>
            {() => (
              <DefaultCard
                style={{ marginBottom: paddings.lg }}
                icon={<DefaultCardIcon iconName="phone" />}
                title="Ligar para o restaurante"
                subtitle="Se seu problema puder ser resolvido pelo restaurante, entre em contato diretamente"
              />
            )}
          </Pressable>
        ) : null}
        <Pressable onPress={() => setReportIssueModalShown(true)}>
          {() => (
            <DefaultCard
              icon={<DefaultCardIcon iconName="alert" variant="warning" />}
              title="Estou com um problema"
              subtitle="Abrir uma ocrrência para relatar algum problema com o pedido"
            />
          )}
        </Pressable>
      </View>
    </DefaultScrollView>
  );
}
