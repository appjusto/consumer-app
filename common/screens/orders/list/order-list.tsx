import { EmptyIcon } from '@/common/components/modals/error/icon';
import { DefaultText } from '@/common/components/texts/DefaultText';
import paddings from '@/common/styles/paddings';
import { Order, WithId } from '@appjusto/types';
import { router } from 'expo-router';
import { Pressable, View, ViewProps } from 'react-native';
import { OrderListItem } from './order-list-item';

interface Props extends ViewProps {
  title?: string;
  emptyText?: string;
  orders: WithId<Order>[];
}

export const OrderList = ({ orders, title, emptyText, style, children, ...props }: Props) => {
  return (
    <View style={[{ padding: paddings.lg }, style]} {...props}>
      {title ? (
        <DefaultText style={{ marginBottom: paddings.lg }} size="lg">
          {title}
        </DefaultText>
      ) : null}
      <View>
        {orders.length ? (
          orders.map((order) => (
            <Pressable
              key={order.id}
              onPress={() =>
                router.navigate({
                  pathname: '/(logged)/(tabs)/(orders)/[id]/detail',
                  params: { id: order.id },
                })
              }
            >
              <OrderListItem order={order} />
            </Pressable>
          ))
        ) : (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <EmptyIcon />
            {emptyText ? (
              <DefaultText
                style={{ marginTop: paddings.lg, textAlign: 'center' }}
                color="neutral800"
              >
                {emptyText}
              </DefaultText>
            ) : null}
          </View>
        )}
        {children}
      </View>
    </View>
  );
};
