import { useObserveOrderConfirmation } from '@/api/orders/handshake/useObserveOrderConfirmation';
import { DefaultText } from '@/common/components/texts/DefaultText';
import borders from '@/common/styles/borders';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Order, WithId } from '@appjusto/types';
import { View, ViewProps } from 'react-native';
import { HelpButton } from './buttons/help-button';

interface Props extends ViewProps {
  order: WithId<Order>;
}

export const OngoingOrderHandshake = ({ order, style, ...props }: Props) => {
  const { dispatchingStatus, fulfillment } = order;
  const delivery = fulfillment === 'delivery';
  const confirmation = useObserveOrderConfirmation(order?.id);
  // UI
  if (!delivery) return null;
  if (dispatchingStatus === 'outsourced') return null;
  if (!confirmation) return null;
  return (
    <View
      style={[
        {
          padding: paddings.lg,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: paddings.lg,
          paddingVertical: paddings.lgg,
          backgroundColor: colors.white,
          ...borders.light,
        },
        style,
      ]}
      {...props}
    >
      <View>
        <DefaultText size="sm" color="neutral700">
          Código da entrega
        </DefaultText>
        <DefaultText style={{ paddingTop: paddings.sm }} size="lg" color="black">
          {confirmation.handshakeChallenge}
        </DefaultText>
      </View>
      <HelpButton onPress={() => null} />
    </View>
  );
};
