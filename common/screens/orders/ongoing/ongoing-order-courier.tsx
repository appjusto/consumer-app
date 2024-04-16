import { useContextApi } from '@/api/ApiContext';
import { aboutCourier } from '@/api/orders/courier/about';
import { SimpleBadge } from '@/common/components/badges/simple-badge';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { LinkButton } from '@/common/components/buttons/link/LinkButton';
import { CircledView } from '@/common/components/containers/CircledView';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import borders from '@/common/styles/borders';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Order, WithId } from '@appjusto/types';
import { User } from 'lucide-react-native';
import { useState } from 'react';
import { Linking, View, ViewProps } from 'react-native';
import Selfie from '../../profile/images/selfie';

interface Props extends ViewProps {
  order: WithId<Order>;
}

export const OngoingOrderCourier = ({ order, style, ...props }: Props) => {
  // params
  const { fulfillment, status, courier } = order;
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  // state
  const [loading, setLoading] = useState(false);
  // handlers
  const completeDeliveryHandler = () => {
    setLoading(true);
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
  if (!courier?.name && !courier?.shareLink) return null;
  if (fulfillment !== 'delivery') return null;
  if (status !== 'ready' && status !== 'dispatching') return null;
  const courierId = courier?.id;
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <DefaultText color="neutral700">Sobre o entregador</DefaultText>
          <DefaultText style={{ marginTop: paddings.xs }} size="md" color="black">
            {courier.name}
          </DefaultText>
          {courierId ? (
            <DefaultText style={{ marginTop: paddings['2xs'] }}>{aboutCourier(order)}</DefaultText>
          ) : null}
        </View>
        {courierId ? (
          <Selfie courierId={courierId} size={48} />
        ) : (
          <CircledView
            style={{ backgroundColor: colors.neutral100, borderColor: colors.neutral100 }}
          >
            <User size={24} color={colors.neutral700} />
          </CircledView>
        )}
      </View>
      {!courierId ? (
        <View>
          <SimpleBadge variant="warning">Entrega realizada por empresa parceira</SimpleBadge>
          <DefaultButton
            style={{ marginTop: paddings.lg }}
            title="Já recebi meu pedido"
            disabled={loading}
            loading={loading}
            onPress={completeDeliveryHandler}
          />
          {courier.shareLink ? (
            <LinkButton style={{ alignSelf: 'center' }} variant="ghost" onPress={openShareLink}>
              Acompanhar pedido
            </LinkButton>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};
