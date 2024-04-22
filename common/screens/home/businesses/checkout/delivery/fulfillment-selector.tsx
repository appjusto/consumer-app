import { HorizontalSelector } from '@/common/components/containers/horizontal-selector/horizontal-selector';
import { Fulfillment, Order, WithId } from '@appjusto/types';

import { useEffect } from 'react';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  order: WithId<Order>;
  acceptedFulfillments: Fulfillment[];
  onSelectFulfillment: (fulfillment: Fulfillment) => void;
}

export const FulfillmentSelector = ({
  order,
  acceptedFulfillments,
  onSelectFulfillment,
  style,
  ...props
}: Props) => {
  // state
  const fulfillment = order.fulfillment;
  const fulfillmentSelectorData = (
    acceptedFulfillments.includes('delivery') ? [{ title: 'Entrega', fulfillment: 'delivery' }] : []
  ).concat(
    acceptedFulfillments.includes('take-away')
      ? [{ title: 'Retirada', fulfillment: 'take-away' }]
      : []
  );
  const fulfillmentSelectorIndex = fulfillmentSelectorData.findIndex(
    (value) => value.fulfillment === fulfillment
  );
  // handlers
  const updateFulfillment = (index: number) => {
    const updatedFulfillment = fulfillmentSelectorData[index]?.fulfillment as Fulfillment;
    if (!fulfillment || fulfillment === updatedFulfillment) return;
    onSelectFulfillment(updatedFulfillment);
  };
  // side effects
  useEffect(() => {}, []);
  // UI
  if (!acceptedFulfillments.length || !fulfillment) return null;
  return (
    <View style={[{}, style]} {...props}>
      <HorizontalSelector
        data={fulfillmentSelectorData}
        selectedIndex={fulfillmentSelectorIndex}
        onSelect={updateFulfillment}
      />
    </View>
  );
};
