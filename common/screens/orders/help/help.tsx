import { useContextApi } from '@/api/ApiContext';
import { trackEvent } from '@/api/analytics/track';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useObserveBusiness } from '@/api/business/useObserveBusiness';
import { issueTypeForOrder } from '@/api/incidents/issueTypeForOrder';
import { useContextOrder } from '@/api/orders/context/order-context';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { SelectIssueModal } from '@/common/components/modals/issues/select-issue-modal';
import DefaultCard from '@/common/components/views/cards/DefaultCard';
import { DefaultCardIcon } from '@/common/components/views/cards/icon';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { CancelOrderModal } from '@/common/screens/incident/cancel-modal';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Issue } from '@appjusto/types';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, View, ViewProps } from 'react-native';

interface Props extends ViewProps {}

export const HelpScreen = ({ style, ...props }: Props) => {
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  const order = useContextOrder();
  const orderId = order?.id;
  // state
  const issueType = issueTypeForOrder(order);
  const cancelIssueType =
    order?.type === 'food'
      ? 'consumer-cancel-food-with-payment'
      : order?.type === 'p2p'
      ? 'consumer-cancel-p2p-with-payment'
      : undefined;
  const phone = useObserveBusiness(order?.business?.id)?.phone;
  const [loading, setLoading] = useState(false);
  const [reportIssueModalShown, setReportIssueModalShown] = useState(false);
  const [cancelModalShown, setCancelModalShown] = useState(false);
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
        router.back();
      });
  };
  const cancelHandler = (acknowledgedCosts: number, issue: Issue, comment: string) => {
    if (!orderId) return;
    trackEvent('Cancelou pedido');
    setLoading(true);
    api
      .orders()
      .cancelOrder(orderId, acknowledgedCosts, issue, comment)
      .catch((error: unknown) => {
        if (error instanceof Error) showToast(error.message, 'error');
      })
      .finally(() => {
        setCancelModalShown(false);
        setLoading(false);
        router.back();
      });
  };
  // UI
  if (!order) return null;
  return (
    <DefaultScrollView style={{ ...screens.default, backgroundColor: colors.neutral50 }} {...props}>
      <Stack.Screen options={{ title: 'Ajuda' }} />
      <SelectIssueModal
        title="Qual o problema que você quer relatar?"
        issueType={issueType}
        visible={reportIssueModalShown}
        onConfirm={createIncident}
        loading={loading}
        onDismiss={() => setReportIssueModalShown(false)}
      />
      <CancelOrderModal
        title="Por que você está cancelando o seu pedido?"
        issueType={cancelIssueType}
        visible={cancelModalShown}
        onConfirm={cancelHandler}
        loading={loading}
        onDismiss={() => setCancelModalShown(false)}
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
              subtitle="Abrir uma ocorrência para relatar algum problema com o pedido"
            />
          )}
        </Pressable>
        <Pressable onPress={() => setCancelModalShown(true)}>
          {() => (
            <DefaultCard
              style={{ marginTop: paddings.lg }}
              icon={<DefaultCardIcon iconName="cancel" variant="destructive" />}
              title="Cancelar pedido"
              subtitle="Quero cancelar meu pedido"
            />
          )}
        </Pressable>
      </View>
    </DefaultScrollView>
  );
};
