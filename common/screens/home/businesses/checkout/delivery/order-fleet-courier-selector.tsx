import {
  useContextOrder,
  useContextOrderBusiness,
  useContextOrderFares,
  useContextOrderOptions,
} from '@/api/orders/context/order-context';
import { HorizontalSelector } from '@/common/components/containers/horizontal-selector/horizontal-selector';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HR } from '@/common/components/views/HR';
import { Loading } from '@/common/components/views/Loading';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { useEffect, useState } from 'react';
import { View, ViewProps } from 'react-native';
import { OrderCourierSelector } from './order-courier-selector';
import { OrderFleetSelector } from './order-fleet-selector';

interface Props extends ViewProps {}

export const OrderFleetCourierSelector = ({ style, ...props }: Props) => {
  // context
  const order = useContextOrder();
  const { fares } = useContextOrderFares();
  const business = useContextOrderBusiness();
  const { courier } = useContextOrderOptions() ?? {};
  // state
  const [selectedIndex, setSelectedIndex] = useState(0);
  // side effects
  useEffect(() => {
    if (!courier) return;
    setSelectedIndex(1);
  }, [courier]);
  // UI
  if (order?.fulfillment !== 'delivery') return null;
  const logisticsByBusiness = order.type === 'food' && !business?.logistics;
  // console.log('businessLogistics', order.type, business?.logistics, logisticsByBusiness);
  // console.log('fares', fares);
  return (
    <View style={[{}, style]} {...props}>
      <HR style={{ marginBottom: paddings.xl }} />
      {!logisticsByBusiness ? (
        <HorizontalSelector
          data={[{ title: 'Escolher Frota' }, { title: 'Escolher entregador(a)' }]}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
        />
      ) : (
        <DefaultText size="lg">Entrega</DefaultText>
      )}
      {selectedIndex === 0 ? (
        <OrderFleetSelector businessLogistics={logisticsByBusiness} />
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
