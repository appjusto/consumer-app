import { useContextApi } from '@/api/ApiContext';
import { useContextOrderQuote } from '@/api/orders/context/order-provider';
import { DefaultText } from '@/common/components/texts/DefaultText';
import paddings from '@/common/styles/paddings';
import { Stack, router } from 'expo-router';
import { Pressable, View, ViewProps } from 'react-native';
import { BusinessCartHeader } from './business-cart-header';
import { BusinessCartItem } from './business-cart-item';

interface Props extends ViewProps {}

export const BusinessCart = ({ style, ...props }: Props) => {
  // context
  const api = useContextApi();
  const quote = useContextOrderQuote();
  const orderId = quote?.id;
  const clearable = quote?.items?.length && quote.items.length > 0;
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
      <BusinessCartHeader style={{ padding: paddings.lg }} business={quote.business} />
      <View style={{ paddingHorizontal: paddings.lg }}>
        {(quote.items ?? []).map((item) => (
          <BusinessCartItem style={{ marginTop: paddings.lg }} key={item.id} item={item} />
        ))}
      </View>
    </View>
  );
};
