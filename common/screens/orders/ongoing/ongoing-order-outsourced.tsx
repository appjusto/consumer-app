import { useContextApi } from '@/api/ApiContext';
import { SimpleBadge } from '@/common/components/badges/simple-badge';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { LinkButton } from '@/common/components/buttons/link/LinkButton';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import borders from '@/common/styles/borders';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Order, WithId } from '@appjusto/types';
import { useState } from 'react';
import { Linking, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  order: WithId<Order>;
}

export const OngoingOrderOutsourcedCourier = ({ order, style, ...props }: Props) => {
  // params
  const { courier, fare } = order;
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  // state
  const [loading, setLoading] = useState(false);
  // handlers
  const completeDeliveryHandler = () => {
    setLoading(true);
    console.log(order.id);
    api
      .orders()
      .completeDelivery(order.id)
      .catch((error: unknown) => {
        setLoading(false);
        const message =
          error instanceof Error ? error.message : 'Não foi possível concluir o pedido';
        showToast(message, 'error');
      });
  };
  const openShareLink = () => {
    if (!courier?.shareLink) return;
    Linking.openURL(courier?.shareLink);
  };
  // UI
  if (!courier) return null;
  if (order.status !== 'dispatching') return null;
  const title =
    fare?.courier?.payee === 'platform'
      ? 'Entrega realizada por empresa parceira'
      : 'Entrega realizada pelo restaurante';
  return (
    <View
      style={[
        {
          paddingHorizontal: paddings.lg,
          paddingVertical: paddings.lgg,
          marginBottom: paddings.lg,
          backgroundColor: colors.white,
          ...borders.light,
        },
        style,
      ]}
      {...props}
    >
      <SimpleBadge variant="warning">{title}</SimpleBadge>
      {courier.name ? (
        <DefaultText style={{ marginTop: paddings.lg }} size="md" color="black">
          {courier.name}
        </DefaultText>
      ) : null}
      <DefaultButton
        style={{ marginTop: paddings.lg }}
        title="Já recebi meu pedido"
        disabled={loading}
        loading={loading}
        onPress={completeDeliveryHandler}
      />
      {courier.shareLink ? (
        <LinkButton
          style={{ marginTop: paddings.sm, alignSelf: 'center' }}
          variant="ghost"
          onPress={openShareLink}
        >
          Acompanhar pedido
        </LinkButton>
      ) : null}
    </View>
  );
};
