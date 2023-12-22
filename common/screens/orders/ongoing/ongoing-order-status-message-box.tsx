import { isOrderOngoing } from '@/api/orders/status';
import { getOngoingOrderDescription } from '@/api/orders/status/getOngoingOrderDescription';
import { getOrderStatusAsText } from '@/api/orders/status/getOrderStatusAsText';
import { DefaultText } from '@/common/components/texts/DefaultText';
import borders from '@/common/styles/borders';
import colors from '@/common/styles/colors';
import lineHeight from '@/common/styles/lineHeight';
import paddings from '@/common/styles/paddings';
import { Order } from '@appjusto/types';
import { CheckCircle2, Clock3 } from 'lucide-react-native';
import { View, ViewProps } from 'react-native';
import { HelmetIcon } from './icons/helmet';

interface Props extends ViewProps {
  order: Order;
}

export const OngoingOrderStatusMessageBox = ({ order, style, ...props }: Props) => {
  const { status, dispatchingStatus, dispatchingState } = order;
  // UI
  if (!isOrderOngoing(status)) return null;
  const variant =
    status === 'delivered' || dispatchingState === 'arrived-destination' ? 'success' : 'info';
  const backgroundColor = () => {
    if (variant === 'info') return colors.info100;
    if (variant === 'success') return colors.success100;
  };
  const borderColor = () => {
    if (variant === 'info') return colors.info300;
    if (variant === 'success') return colors.success300;
  };
  const icon = () => {
    if (status === 'preparing') return <Clock3 color={colors.info500} size={22} />;
    if (status === 'ready') return <CheckCircle2 color={colors.info500} size={22} />;
    if (status === 'dispatching') {
      if (dispatchingState === 'arrived-destination')
        return <CheckCircle2 color={colors.success900} size={22} />;
      else return <HelmetIcon color={colors.info500} />;
    }
  };
  return (
    <View
      style={[
        style,
        {
          paddingHorizontal: paddings.lg,
          paddingVertical: paddings.lgg,
          backgroundColor: backgroundColor(),
          ...borders.default,
          borderColor: borderColor(),
        },
      ]}
      {...props}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View>{icon()}</View>
        <View style={{ marginLeft: paddings.lg }}>
          <DefaultText style={{ marginBottom: paddings.xs }} size="md" color="black">
            {getOrderStatusAsText(status, dispatchingState)}
          </DefaultText>

          <DefaultText
            color="neutral800"
            size="xs"
            style={[
              {
                ...lineHeight.sm,
                flexWrap: 'wrap',
                marginRight: paddings.lg,
              },
            ]}
          >
            {getOngoingOrderDescription(order)}
          </DefaultText>
        </View>
      </View>
    </View>
  );
};
