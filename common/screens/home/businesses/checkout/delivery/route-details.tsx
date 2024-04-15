import { RoundedText } from '@/common/components/texts/RoundedText';
import { MessageBox } from '@/common/components/views/MessageBox';
import { formatDistance } from '@/common/formatters/distance';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Order } from '@appjusto/types';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  order: Order;
}

export const RouteDetails = ({ order, style, ...props }: Props) => {
  const marginTop = order.type === 'food' ? paddings.md : 0;
  return (
    <View style={[{}, style]} {...props}>
      {order.route?.distance ? (
        <RoundedText
          style={{ marginTop, backgroundColor: colors.neutral50 }}
        >{`Distância: ${formatDistance(order.route.distance)}`}</RoundedText>
      ) : null}
      {order.route?.issue ? (
        <MessageBox style={{ marginTop }} variant="error">
          {order.route.issue}
        </MessageBox>
      ) : null}
    </View>
  );
};
