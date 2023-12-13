import { useContextApi } from '@/api/ApiContext';
import { HorizontalSelector } from '@/common/components/containers/horizontal-selector/horizontal-selector';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { Fulfillment, Order, WithId } from '@appjusto/types';
import crashlytics from '@react-native-firebase/crashlytics';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  order: WithId<Order>;
}

export const FulfillmentSelector = ({ order, style, ...props }: Props) => {
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  // state
  const orderId = order.id;
  const fulfillment = order.fulfillment;
  const fulfillmentSelectorData = fulfillment ? [{ title: 'Entrega' }, { title: 'Retirada' }] : [];
  const fulfillmentSelectorIndex = fulfillment === 'take-away' ? 1 : 0;
  // handlers
  const updateFulfillment = (index: number) => {
    const updatedFulfillment: Fulfillment = index === 0 ? 'delivery' : 'take-away';
    if (fulfillment === updatedFulfillment) return;
    api
      .orders()
      .updateOrder(orderId, { fulfillment: updatedFulfillment })
      .catch((error) => {
        console.error(error);
        if (error instanceof Error) crashlytics().recordError(error);
        showToast('Não foi possível atualizar a forma de entrega. Tente novamente.', 'error');
      });
  };
  // UI
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
