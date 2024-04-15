import { DefaultText } from '@/common/components/texts/DefaultText';
import borders from '@/common/styles/borders';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Order } from '@appjusto/types';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  order: Order;
}

export const OngoingOrderPickupAddress = ({ order, style, ...props }: Props) => {
  const { type, origin } = order;
  if (type !== 'p2p') return null;
  const address = origin?.address;
  // UI
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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <DefaultText color="neutral700">
            {order.fulfillment === 'delivery' ? 'Coleta em' : 'Retirar em'}
          </DefaultText>
          <DefaultText style={{ marginTop: paddings.sm }} size="md" color="black">
            {address?.main}
          </DefaultText>
          <DefaultText style={{ marginTop: paddings.xs }} color="neutral800">
            {address?.secondary}
          </DefaultText>
          {origin?.additionalInfo ? (
            <DefaultText style={{ marginTop: paddings.sm }} size="xs" color="neutral800">
              {origin.additionalInfo}
            </DefaultText>
          ) : null}
          {origin?.instructions ? (
            <DefaultText style={{ marginTop: paddings.sm }} size="xs" color="neutral800">
              {origin.instructions}
            </DefaultText>
          ) : null}
        </View>
      </View>
    </View>
  );
};
