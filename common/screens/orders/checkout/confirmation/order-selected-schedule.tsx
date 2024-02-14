import { toDate } from '@/api/firebase/timestamp';
import { useContextOrder } from '@/api/orders/context/order-context';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { formatTimestamp, timestampWithETA } from '@/common/formatters/timestamp';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Dayjs } from '@appjusto/dates';
import { capitalize } from 'lodash';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {}

export const OrderSelectedSchedule = ({ style, ...props }: Props) => {
  // context
  const order = useContextOrder();
  // UI
  const deliveryEstimate = order?.scheduledTo ?? order?.arrivals?.destination?.estimate;
  if (!deliveryEstimate) return;
  return (
    <View
      style={[
        {
          padding: paddings.lg,
          backgroundColor: colors.white,
          borderColor: colors.neutral100,
          borderWidth: 1,
          borderRadius: 8,
        },
        style,
      ]}
      {...props}
    >
      <View style={{ flexDirection: 'row' }}>
        <View
          style={{
            paddingVertical: paddings.sm,
            paddingHorizontal: paddings.lg,
            // justifyContent: 'flex-end',
            backgroundColor: colors.primary100,
            borderColor: colors.primary300,
            borderWidth: 1,
            borderRadius: 8,
          }}
        >
          <DefaultText>{capitalize(formatTimestamp(deliveryEstimate, 'ddd'))}</DefaultText>
          <DefaultText style={{ textAlign: 'center', borderWidth: 0 }} size="lg">
            {toDate(deliveryEstimate).getDate()}
          </DefaultText>
        </View>
        <View style={{ marginLeft: paddings.lg }}>
          <DefaultText size="md">{`${Dayjs(toDate(deliveryEstimate)).calendar()}`}</DefaultText>
          <DefaultText style={{ marginTop: paddings.sm }} color="neutral700">
            {timestampWithETA(deliveryEstimate)}
          </DefaultText>
        </View>
      </View>
    </View>
  );
};
