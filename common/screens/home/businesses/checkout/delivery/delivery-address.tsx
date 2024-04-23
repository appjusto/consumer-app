import { LinkButton } from '@/common/components/buttons/link/LinkButton';
import { DefaultText } from '@/common/components/texts/DefaultText';
import paddings from '@/common/styles/paddings';
import { percentOfWidth } from '@/common/version/device';
import { Order, WithId } from '@appjusto/types';
import { router } from 'expo-router';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  order: WithId<Order>;
}

export const DeliveryAddress = ({ order, style, ...props }: Props) => {
  // handlers
  const changeHandler = () => {
    router.navigate({
      pathname: '/(logged)/checkout/[orderId]/places',
      params: { orderId: order.id },
    });
  };
  // UI
  if (order.type === 'p2p') return null;
  const place = order.fulfillment === 'delivery' ? order.destination : order.origin;
  const address = place?.address;
  return (
    <View style={[{ marginBottom: paddings.xl }, style]} {...props}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{}}>
          <DefaultText color="neutral700">
            {order.fulfillment === 'delivery' ? 'Entregar em' : 'Retirar em'}
          </DefaultText>
          <DefaultText
            style={{ marginTop: paddings.sm, flexWrap: 'wrap', maxWidth: percentOfWidth(70) }}
            size="md"
          >
            {address?.main}
          </DefaultText>
          <DefaultText
            style={{ marginTop: paddings.sm, flexWrap: 'wrap', maxWidth: percentOfWidth(70) }}
            color="neutral700"
          >{`${address?.secondary}${
            place?.additionalInfo ? ` \u00B7 ${place.additionalInfo}` : ''
          }`}</DefaultText>
        </View>
        {order.fulfillment === 'delivery' ? (
          <LinkButton variant="ghost" onPress={changeHandler}>
            Trocar
          </LinkButton>
        ) : null}
      </View>
    </View>
  );
};
