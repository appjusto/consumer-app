import { LinkButton } from '@/common/components/buttons/link/LinkButton';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { RoundedText } from '@/common/components/texts/RoundedText';
import { HR } from '@/common/components/views/HR';
import { formatDistance } from '@/common/formatters/distance';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Order } from '@appjusto/types';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  order: Order;
}

export const DeliveryAddress = ({ order, style, ...props }: Props) => {
  // UI
  const place = order.fulfillment === 'delivery' ? order.destination : order.origin;
  const address = place?.address;
  return (
    <View style={[{}, style]} {...props}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <DefaultText color="neutral700">
            {order.fulfillment === 'delivery' ? 'Entregar em' : 'Retirar em'}
          </DefaultText>
          <DefaultText style={{ marginTop: paddings.sm }} size="md">
            {address?.main}
          </DefaultText>
          <DefaultText
            style={{ marginTop: paddings.sm }}
            color="neutral700"
          >{`${address?.secondary}${
            place?.additionalInfo ? ` \u00B7 ${place.additionalInfo}` : ''
          }`}</DefaultText>
        </View>
        <LinkButton variant="ghost" onPress={() => null}>
          Trocar
        </LinkButton>
      </View>
      {order.route?.distance ? (
        <RoundedText
          style={{ marginTop: paddings.md, backgroundColor: colors.neutral50 }}
        >{`Distância: ${formatDistance(order.route.distance)}`}</RoundedText>
      ) : null}
      <HR style={{ marginTop: paddings.xl }} />
    </View>
  );
};
