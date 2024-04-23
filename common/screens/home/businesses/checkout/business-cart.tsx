import { useContextApi } from '@/api/ApiContext';
import { DefaultText } from '@/common/components/texts/DefaultText';
import paddings from '@/common/styles/paddings';
import { Order, WithId } from '@appjusto/types';
import { Stack, router } from 'expo-router';
import { Pressable, View, ViewProps } from 'react-native';
import { BusinessCartHeader } from './business-cart-header';
import { BusinessCartItem } from './business-cart-item';

interface Props extends ViewProps {
  order: WithId<Order>;
  editable?: boolean;
}

export const BusinessCart = ({ order, editable = true, style, ...props }: Props) => {
  // context
  const api = useContextApi();
  const orderId = order?.id;
  const clearable = editable && order?.items?.length && order.items.length > 0;
  // handlers
  const deleteOrder = async () => {
    if (!orderId) return;
    await api.orders().updateOrder(orderId, { items: [] });
    router.back();
  };
  // UI
  if (!order?.business?.id) return null;
  return (
    <View style={[{}, style]} {...props}>
      <Stack.Screen
        options={{
          headerRight: () =>
            clearable ? (
              <Pressable onPress={deleteOrder}>
                <DefaultText color="error900">Limpar</DefaultText>
              </Pressable>
            ) : null,
        }}
      />
      <BusinessCartHeader
        style={{ padding: paddings.lg }}
        business={order.business}
        editable={editable}
      />
      <View style={{ paddingHorizontal: paddings.lg }}>
        {(order.items ?? []).map((item) => (
          <BusinessCartItem
            style={{ marginTop: paddings.xl }}
            key={item.id}
            order={order}
            item={item}
            editable={editable}
          />
        ))}
      </View>
    </View>
  );
};
