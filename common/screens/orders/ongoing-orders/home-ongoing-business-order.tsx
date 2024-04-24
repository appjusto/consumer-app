import { useOrderDeliveryEstimate } from '@/api/orders/estimate/useOrderDeliveryEstimate';
import { getOrderStatusAsText } from '@/api/orders/status/getOrderStatusAsText';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { Time, formatTimestamp, timestampWithETA } from '@/common/formatters/timestamp';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Order, WithId } from '@appjusto/types';
import { CheckCircle2 } from 'lucide-react-native';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  order: WithId<Order>;
}

export const HomeOngoingBusinessOrder = ({ order, style, ...props }: Props) => {
  // helpers
  const { fulfillment, code, status, type, business } = order;
  const delivery = fulfillment === 'delivery';
  const estimateLabel = delivery ? 'Previsão de entrega' : 'Previsão de preparo';
  const estimate = useOrderDeliveryEstimate(order);
  // UI
  return (
    <View
      style={[
        {
          paddingHorizontal: paddings.lg,
          paddingVertical: paddings.lgg,
          backgroundColor: colors.white,
          borderRadius: 8,
          borderColor: colors.neutral100,
          borderWidth: 1,
        },
        style,
      ]}
      {...props}
    >
      {/* status */}
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: paddings.sm,
            paddingVertical: paddings.sm,
            backgroundColor: colors.info100,
            borderRadius: 8,
          }}
        >
          <CheckCircle2 color={colors.info500} size={16} />
          <View style={{ flexDirection: 'row' }}>
            <DefaultText style={{ marginLeft: paddings.xs }} color="info900">
              {getOrderStatusAsText(type, status)}
            </DefaultText>
          </View>
        </View>
      </View>
      {/* body */}
      <View
        style={{
          marginTop: paddings.xs,
          padding: paddings.md,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flex: 1 }}>
          <DefaultText size="xs" color="neutral700">{`#${code}`}</DefaultText>
          <DefaultText
            style={{ marginTop: paddings.sm }}
            size="md"
            color="black"
            numberOfLines={1}
            ellipsizeMode="tail"
          >{`${business?.name}`}</DefaultText>
        </View>
        {estimate ? (
          <View style={{ flex: 1, justifyContent: 'flex-end', borderWidth: 0 }}>
            <DefaultText style={{ alignSelf: 'flex-end' }} size="xs" color="neutral700">
              {estimateLabel}
            </DefaultText>
            <DefaultText
              style={{ marginTop: paddings.sm, alignSelf: 'flex-end' }}
              size="md"
              color="black"
            >
              {delivery ? timestampWithETA(estimate) : formatTimestamp(estimate, Time)}
            </DefaultText>
          </View>
        ) : null}
      </View>
    </View>
  );
};
