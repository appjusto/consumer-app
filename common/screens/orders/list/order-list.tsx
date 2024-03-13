import { isOrderOngoing } from '@/api/orders/status';
import { EmptyIcon } from '@/common/components/modals/error/icon';
import { DefaultText } from '@/common/components/texts/DefaultText';
import paddings from '@/common/styles/paddings';
import { Order, WithId } from '@appjusto/types';
import { Pressable, View, ViewProps } from 'react-native';
import { OrderListItem } from './order-list-item';

interface Props extends ViewProps {
  title?: string;
  emptyText?: string;
  orders: WithId<Order>[];
  onPress: (order: WithId<Order>) => void;
}

export const OrderList = ({
  orders,
  title,
  emptyText,
  style,
  children,
  onPress,
  ...props
}: Props) => {
  // UI
  const ongoingOrders = orders.filter(({ status }) => isOrderOngoing(status));
  const pastOrders = orders.filter(({ status }) => !isOrderOngoing(status));
  if (!ongoingOrders.length && !pastOrders.length) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <EmptyIcon />
        <DefaultText style={{ marginTop: paddings.lg, textAlign: 'center' }} color="neutral800">
          Não há pedidos para o período selecionado.
        </DefaultText>
      </View>
    );
  }
  return (
    <View style={[{ padding: paddings.lg }, style]} {...props}>
      {ongoingOrders.length ? (
        <View style={{ marginBottom: paddings.xl }}>
          <DefaultText style={{ marginBottom: paddings.lg }} size="md">
            Pedidos em aberto
          </DefaultText>
          {ongoingOrders.map((order) => (
            <Pressable key={order.id} onPress={() => onPress(order)}>
              <OrderListItem order={order} />
            </Pressable>
          ))}
        </View>
      ) : null}
      {pastOrders.length ? (
        <View style={{ marginBottom: paddings.xl }}>
          <DefaultText style={{ marginBottom: paddings.lg }} size="md">
            Histórico
          </DefaultText>
          {pastOrders.map((order) => (
            <Pressable key={order.id} onPress={() => onPress(order)}>
              <OrderListItem order={order} />
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
};
