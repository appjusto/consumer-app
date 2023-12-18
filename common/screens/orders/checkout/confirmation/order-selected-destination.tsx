import { useContextOrderQuote } from '@/api/orders/context/order-context';
import { DefaultText } from '@/common/components/texts/DefaultText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {}

export const OrderSelectedDestination = ({ style, ...props }: Props) => {
  // context
  const order = useContextOrderQuote();
  // UI
  const place = order?.fulfillment === 'delivery' ? order?.destination : order?.origin;
  if (!order || !place) return null;
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
      <DefaultText size="md">{place.address.main}</DefaultText>
      <DefaultText style={{ marginTop: paddings.sm }} color="neutral700">{`${
        place.address.secondary
      }${place.additionalInfo ? ` \u00B7 ${place.additionalInfo}` : ''}`}</DefaultText>
    </View>
  );
};
