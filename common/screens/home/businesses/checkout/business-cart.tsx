import { useContextApi } from '@/api/ApiContext';
import { useContextOrder } from '@/api/orders/context/order-context';
import { DefaultText } from '@/common/components/texts/DefaultText';
import paddings from '@/common/styles/paddings';
import { Stack, router } from 'expo-router';
import { Pressable, View, ViewProps } from 'react-native';
import { BusinessCartHeader } from './business-cart-header';
import { BusinessCartItem } from './business-cart-item';

interface Props extends ViewProps {
  editable?: boolean;
}

export const BusinessCart = ({ style, editable = true, ...props }: Props) => {
  // context
  const api = useContextApi();
  const quote = useContextOrder();
  const orderId = quote?.id;
  const clearable = editable && quote?.items?.length && quote.items.length > 0;
  // handlers
  const deleteOrder = async () => {
    if (!orderId) return;
    await api.orders().updateOrder(orderId, { items: [] });
    router.back();
  };
  // UI
  if (!quote?.business) return null;
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
        business={quote.business}
        editable={editable}
      />
      <View style={{ marginTop: paddings.sm, paddingHorizontal: paddings.lg }}>
        {(quote.items ?? []).map((item) => (
          <BusinessCartItem
            style={{ marginTop: paddings.lg }}
            key={item.id}
            item={item}
            editable={editable}
          />
        ))}
      </View>
    </View>
  );
};
