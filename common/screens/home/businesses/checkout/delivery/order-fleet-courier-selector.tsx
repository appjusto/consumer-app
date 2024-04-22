import {
  useContextOrder,
  useContextOrderBusiness,
  useContextOrderFares,
} from '@/api/orders/context/order-context';
import { HorizontalSelector } from '@/common/components/containers/horizontal-selector/horizontal-selector';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { Loading } from '@/common/components/views/Loading';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { useState } from 'react';
import { View, ViewProps } from 'react-native';
import { OrderCourierSelector } from './order-courier-selector';
import { OrderFleetSelector } from './order-fleet-selector';

interface Props extends ViewProps {}

export const OrderFleetCourierSelector = ({ style, ...props }: Props) => {
  // context
  const order = useContextOrder();
  const { fares } = useContextOrderFares();
  const business = useContextOrderBusiness();
  // state
  const [selectedIndex, setSelectedIndex] = useState(0);
  // UI
  if (order?.fulfillment !== 'delivery') return null;
  const businessLogistics = order.type === 'food' && !business?.logistics;
  // console.log('fares', fares);
  return (
    <View style={[{}, style]} {...props}>
      {!businessLogistics ? (
        <HorizontalSelector
          data={[{ title: 'Escolher Frota' }, { title: 'Escolher entregador(a)' }]}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
        />
      ) : (
        <DefaultText size="lg">Entrega</DefaultText>
      )}
      {selectedIndex === 0 ? (
        <OrderFleetSelector businessLogistics={businessLogistics} />
      ) : (
        <OrderCourierSelector />
      )}
      {!fares ? (
        <View style={{ ...screens.centered, marginTop: paddings['2xl'] }}>
          <Loading size="small" />
        </View>
      ) : null}
    </View>
  );
};
