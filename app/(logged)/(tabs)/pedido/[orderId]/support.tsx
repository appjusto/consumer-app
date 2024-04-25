import { useContextApi } from '@/api/ApiContext';
import { trackEvent } from '@/api/analytics/track';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useObserveOrder } from '@/api/orders/useObserveOrder';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { SelectIssueModal } from '@/common/components/modals/issues/select-issue-modal';
import { useOngoingIssueType } from '@/common/components/modals/issues/useOngoingIssueType';
import DefaultCard from '@/common/components/views/cards/DefaultCard';
import { DefaultCardIcon } from '@/common/components/views/cards/icon';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { openWhatsAppSupportURL } from '@/common/constants/openWhatsAppSupportURL';
import { ScreenTitle } from '@/common/screens/title/screen-title';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Issue } from '@appjusto/types';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

export default function OrderSupportScreen() {
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  // params
  const params = useLocalSearchParams<{ orderId: string }>();
  const orderId = params.orderId;
  // state
  const order = useObserveOrder(orderId);
  const businessId = order?.business?.id;
  const [loading, setLoading] = useState(false);
  const issueType = useOngoingIssueType(order);
  const [reportIssueModalShown, setReportIssueModalShown] = useState(false);
  // tracking
  useTrackScreenView('Ajuda com a entrega');
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
  if (!order) return <ScreenTitle title="Ajuda com a corrida" loading />;
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <ScreenTitle title="Ajuda com a corrida" />
      {/* modals */}
      <SelectIssueModal
        title="Qual o problema que você quer relatar?"
        issueType={issueType}
        visible={reportIssueModalShown}
        onConfirm={createIncident}
        loading={loading}
        onDismiss={() => setReportIssueModalShown(false)}
      />
      {/* */}
      <View
        style={{
          flex: 1,
          backgroundColor: colors.neutral50,
          paddingVertical: paddings.xl,
          paddingHorizontal: paddings.lg,
        }}
      >
        <Pressable onPress={() => setReportIssueModalShown(true)}>
          {() => (
            <DefaultCard
              icon={<DefaultCardIcon iconName="alert" variant="warning" />}
              title="Tive um problema"
              subtitle="Abrir uma ocrrência para relatar algum problema durante a entrega"
            />
          )}
        </Pressable>
        {businessId ? (
          <Pressable
            onPress={() => {
              router.navigate({
                pathname: '/(logged)/(tabs)/pedido/[id]/chat/[counterpart]',
                params: { id: orderId, counterpart: businessId },
              });
            }}
          >
            {() => (
              <DefaultCard
                style={{ marginTop: paddings.lg }}
                icon={<DefaultCardIcon iconName="chat" variant="warning" />}
                title="Preciso falar com o restaurante"
                subtitle="Abrir chat direto com o restaurante"
              />
            )}
          </Pressable>
        ) : null}
        <Pressable onPress={() => openWhatsAppSupportURL('Ajuda com a corrida')}>
          {() => (
            <DefaultCard
              style={{ marginTop: paddings.lg }}
              icon={<DefaultCardIcon iconName="chat" variant="warning" />}
              title="Preciso falar com o AppJusto"
              subtitle="Fale com a gente através do nosso WhatsApp"
            />
          )}
        </Pressable>
      </View>
    </DefaultScrollView>
  );
}
