import { DefaultText } from '@/common/components/texts/DefaultText';
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
  if (order.fulfillment !== 'delivery') return null;
  return (
    <View style={[{ marginBottom: paddings.xl }, style]} {...props}>
      {order.type === 'p2p' ? (
        <DefaultText style={{ marginBottom: paddings.lg }} size="lg">
          Detalhes da rota
        </DefaultText>
      ) : null}
      {order.route?.distance ? (
        <RoundedText style={{ backgroundColor: colors.neutral50 }}>{`Distância: ${formatDistance(
          order.route.distance
        )}`}</RoundedText>
      ) : null}
      {order.route?.issue ? (
        <MessageBox style={{}} variant="error">
          {order.route.issue}
        </MessageBox>
      ) : null}
    </View>
  );
};
