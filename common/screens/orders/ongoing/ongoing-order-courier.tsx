import { aboutCourier } from '@/api/orders/courier/about';
import { DefaultText } from '@/common/components/texts/DefaultText';
import borders from '@/common/styles/borders';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Order } from '@appjusto/types';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  order: Order;
}

export const OngoingOrderCourier = ({ order, style, ...props }: Props) => {
  const { status, courier } = order;
  // UI
  if (status !== 'dispatching') return null;
  if (!courier?.id) return null;
  return (
    <View
      style={[
        {
          paddingHorizontal: paddings.lg,
          paddingVertical: paddings.lgg,
          backgroundColor: colors.white,
          ...borders.light,
        },
        style,
      ]}
      {...props}
    >
      <DefaultText color="neutral700">Sobre o entregador</DefaultText>
      <DefaultText style={{ marginTop: paddings.xs }} size="md" color="black">
        {courier.name}
      </DefaultText>
      <DefaultText>{aboutCourier(order)}</DefaultText>
    </View>
  );
};
