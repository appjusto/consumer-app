import paddings from '@/common/styles/paddings';
import { Order, WithId } from '@appjusto/types';
import { View, ViewProps } from 'react-native';
import { OrderMap } from '../map/order-map';
import { OngoingOrderStatusMessageBox } from './ongoing-order-status-message-box';

interface Props extends ViewProps {
  order: WithId<Order>;
}

export const OngoingOrderMapInfo = ({ order, style, ...props }: Props) => {
  // UI
  const visible = order.status === 'dispatching';
  // const visible = order.status === 'dispatching' || order.status === 'ready';
  return (
    <View
      style={[
        { borderWidth: 0 },
        !visible ? { padding: paddings.lg, paddingBottom: 0 } : {},
        style,
      ]}
      {...props}
    >
      <OrderMap order={order} visible={visible} />
      <OngoingOrderStatusMessageBox
        style={
          visible
            ? {
                position: 'absolute',
                left: paddings.lg,
                right: paddings.lg,
                bottom: paddings.lg,
              }
            : {}
        }
        order={order}
      />
    </View>
  );
};
