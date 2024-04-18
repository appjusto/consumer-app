import { FailedOrdersStatuses } from '@/api/orders/status';
import { getOrderDescription } from '@/api/orders/status/getOrderDescription';
import { getOrderStatusAsText } from '@/api/orders/status/getOrderStatusAsText';
import { DefaultText } from '@/common/components/texts/DefaultText';
import borders from '@/common/styles/borders';
import colors from '@/common/styles/colors';
import lineHeight from '@/common/styles/lineHeight';
import paddings from '@/common/styles/paddings';
import { Order } from '@appjusto/types';
import { CheckCircle2, Clock3, XCircle } from 'lucide-react-native';
import { View, ViewProps } from 'react-native';
import { HelmetIcon } from './icons/helmet';

interface Props extends ViewProps {
  order: Order;
}

export const OngoingOrderStatusMessageBox = ({ order, style, ...props }: Props) => {
  const { status, type, dispatchingState } = order;
  // UI
  // if (!isOrderOngoing(status)) return null;
  const variant = (() => {
    if (status === 'delivered' || dispatchingState === 'arrived-destination') return 'success';
    if (FailedOrdersStatuses.includes(status)) return 'error';
    return 'info';
  })();
  const backgroundColor = () => {
    if (variant === 'info') return colors.info100;
    if (variant === 'success') return colors.success100;
    if (variant === 'error') return colors.error100;
  };
  const borderColor = () => {
    if (variant === 'info') return colors.info300;
    if (variant === 'success') return colors.success300;
    if (variant === 'error') return colors.error500;
  };
  const icon = () => {
    if (status === 'preparing') return <Clock3 color={colors.info500} size={22} />;
    if (status === 'ready') return <CheckCircle2 color={colors.info500} size={22} />;
    if (status === 'dispatching') {
      if (dispatchingState === 'arrived-destination')
        return <CheckCircle2 color={colors.success900} size={22} />;
      else return <HelmetIcon color={colors.info500} />;
    }
    if (status === 'delivered') return <CheckCircle2 color={colors.primary900} />;
    if (FailedOrdersStatuses.includes(status)) return <XCircle color={colors.error500} />;
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
            {getOrderStatusAsText(type, status)}
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
            {getOrderDescription(order)}
          </DefaultText>
        </View>
      </View>
    </View>
  );
};
