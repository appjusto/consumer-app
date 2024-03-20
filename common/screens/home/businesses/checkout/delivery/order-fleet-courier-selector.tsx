import { useContextOrder, useContextOrderFares } from '@/api/orders/context/order-context';
import { HorizontalSelector } from '@/common/components/containers/horizontal-selector/horizontal-selector';
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
  // state
  const [selectedIndex, setSelectedIndex] = useState(0);
  // UI
  if (order?.fulfillment !== 'delivery') return null;
  return (
    <View style={[{}, style]} {...props}>
      <HorizontalSelector
        data={[{ title: 'Escolher Frota' }, { title: 'Escolher entregador(a)' }]}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
      />
      {selectedIndex === 0 ? <OrderFleetSelector /> : <OrderCourierSelector />}
      {!fares ? (
        <View style={{ ...screens.centered, marginTop: paddings['2xl'] }}>
          <Loading size="small" />
        </View>
      ) : null}
    </View>
  );
};
