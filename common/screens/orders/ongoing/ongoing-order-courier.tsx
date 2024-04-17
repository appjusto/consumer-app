import { useFetchCourierById } from '@/api/orders/courier/useFetchCourierById';
import { LinkButton } from '@/common/components/buttons/link/LinkButton';
import { HR } from '@/common/components/views/HR';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Order, WithId } from '@appjusto/types';
import { router } from 'expo-router';
import { MessageCircle } from 'lucide-react-native';
import { View, ViewProps } from 'react-native';
import { CourierCard } from '../../home/businesses/checkout/delivery/courier-card';
import { OngoingOrderOutsourcedCourier } from './ongoing-order-outsourced';

interface Props extends ViewProps {
  order: WithId<Order>;
}

export const OngoingOrderCourier = ({ order, style, ...props }: Props) => {
  // params
  const { fulfillment, status, courier } = order;
  // state
  const courierProfile = useFetchCourierById(order.courier?.id);
  // handlers
  const openChatHandler = () => {
    if (!order.courier?.id) return;
    router.replace({
      pathname: '/(logged)/(tabs)/(orders)/[orderId]/chat/[counterpart]',
      params: { orderId: order.id, counterpart: order.courier.id },
    });
  };
  // UI
  if (fulfillment !== 'delivery') return null;
  if (status !== 'ready' && status !== 'dispatching') return null;
  if (courier?.id) {
    return (
      <CourierCard
        style={{ backgroundColor: colors.white, marginBottom: paddings.lg }}
        courier={courierProfile}
        title="Sua entrega está sendo feita por"
      >
        <View style={{ marginTop: paddings.lg }}>
          <HR />
          <LinkButton
            style={{ alignSelf: 'center' }}
            variant="ghost"
            leftView={
              <MessageCircle style={{ marginRight: paddings.xs }} color={colors.black} size={16} />
            }
            onPress={openChatHandler}
          >
            {`Abrir chat com ${courier.name}`}
          </LinkButton>
        </View>
      </CourierCard>
    );
  }
  if (courier?.shareLink) return <OngoingOrderOutsourcedCourier order={order} />;
  return null;
};
