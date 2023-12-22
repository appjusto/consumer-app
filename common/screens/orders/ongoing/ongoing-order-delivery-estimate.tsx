import { useOrderDeliveryEstimate } from '@/api/orders/estimate/useOrderDeliveryEstimate';
import { isOrderOngoing } from '@/api/orders/status';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { Time, formatTimestamp, timestampWithETA } from '@/common/formatters/timestamp';
import paddings from '@/common/styles/paddings';
import { Order, WithId } from '@appjusto/types';
import { View, ViewProps } from 'react-native';
import { OngoingOrderChatHelp } from './ongoing-order-chat-help';

interface Props extends ViewProps {
  order: WithId<Order>;
}

export const OngoingOrderEstimate = ({ order, style, ...props }: Props) => {
  const { status, fulfillment } = order;
  const delivery = fulfillment === 'delivery';
  const estimate = useOrderDeliveryEstimate(order);
  // UI
  if (!isOrderOngoing(status)) return null;
  if (!estimate) return null;
  const estimateLabel = delivery ? 'Previsão de entrega' : 'Previsão de preparo';
  return (
    <View
      style={[
        {
          padding: paddings.lg,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderWidth: 0,
        },
        style,
      ]}
      {...props}
    >
      <View>
        <DefaultText size="xs" color="neutral700">
          {estimateLabel}
        </DefaultText>
        <DefaultText style={{ paddingTop: paddings.sm }} size="lg" color="black">
          {delivery ? timestampWithETA(estimate) : formatTimestamp(estimate, Time)}
        </DefaultText>
      </View>
      <OngoingOrderChatHelp order={order} />
    </View>
  );
};
