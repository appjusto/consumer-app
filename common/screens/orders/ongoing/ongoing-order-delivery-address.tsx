import { DefaultText } from '@/common/components/texts/DefaultText';
import borders from '@/common/styles/borders';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Order } from '@appjusto/types';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  order: Order;
}

export const OngoingOrderDeliveryAddress = ({ order, style, ...props }: Props) => {
  const { fulfillment, dispatchingStatus, destination, origin } = order;
  const delivery = fulfillment === 'delivery';
  const place = delivery ? destination : origin;
  const address = place?.address;
  const deliveredByAppJusto = delivery && dispatchingStatus === 'confirmed';
  const outsourced = delivery && dispatchingStatus === 'outsourced';
  // UI
  return (
    <View
      style={[
        {
          paddingHorizontal: paddings.lg,
          paddingVertical: paddings.lgg,
          backgroundColor: colors.white,
          ...borders.white,
        },
        style,
      ]}
      {...props}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <DefaultText color="neutral700">
            {order.fulfillment === 'delivery' ? 'Entregar em' : 'Retirar em'}
          </DefaultText>
          <DefaultText style={{ marginTop: paddings.sm }} size="md" color="black">
            {address?.main}
          </DefaultText>
          <DefaultText style={{ marginTop: paddings.xs }} color="neutral800">
            {address?.secondary}
          </DefaultText>
          {place?.additionalInfo ? (
            <DefaultText style={{ marginTop: paddings.sm }} size="xs" color="neutral800">
              {place.additionalInfo}
            </DefaultText>
          ) : null}
        </View>
      </View>
      {deliveredByAppJusto || outsourced ? (
        <View style={{ flexDirection: 'row' }}>
          <View
            style={{
              marginTop: paddings.lg,
              padding: paddings.sm,
              backgroundColor: colors.neutral50,
              borderRadius: 4,
            }}
          >
            <DefaultText color="neutral800" size="xs">
              {`Esta entrega está sendo feita ${
                deliveredByAppJusto ? 'pela rede AppJusto' : 'por uma empresa parceira'
              }`}{' '}
            </DefaultText>
          </View>
        </View>
      ) : null}
    </View>
  );
};
