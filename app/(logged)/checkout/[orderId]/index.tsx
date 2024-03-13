import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder } from '@/api/orders/context/order-context';
import { isOrderEmpty } from '@/api/orders/total/isOrderEmpty';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultInput } from '@/common/components/inputs/default/DefaultInput';
import { BusinessCart } from '@/common/screens/home/businesses/checkout/business-cart';
import { EmptyCart } from '@/common/screens/home/businesses/checkout/empty-cart';
import { CartButton } from '@/common/screens/home/businesses/detail/footer/cart-button';
import { OrderTotalBreakdown } from '@/common/screens/orders/breakdown/order-total-breakdown';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

export default function OrderCheckoutScreen() {
  // context
  const quote = useContextOrder();
  // state
  const [additionalInfo, setAdditionalInfo] = useState('');
  // tracking
  useTrackScreenView('Checkout: sacola', { businessId: quote?.business?.id, orderId: quote?.id });
  // side effects
  // useBackWhenOrderExpires();
  // logs
  console.log('checkout/[orderId]/index', typeof quote, quote?.id);
  // UI
  if (!quote || isOrderEmpty(quote)) return <EmptyCart />;
  return (
    <View style={{ ...screens.default }}>
      <DefaultScrollView>
        <Stack.Screen options={{ title: 'Sua sacola' }} />
        <BusinessCart />
        <DefaultInput
          style={{ padding: paddings.lg }}
          title="Informações adicionais"
          placeholder="Adicione observações do pedido"
          value={additionalInfo}
          onChangeText={setAdditionalInfo}
        />
        <OrderTotalBreakdown style={{ padding: paddings.lg }} order={quote} />
      </DefaultScrollView>
      <View style={{ flex: 1 }} />
      <CartButton
        order={quote}
        variant="checkout"
        disabled={!quote.fare}
        onPress={() =>
          router.navigate({
            pathname: '/(logged)/checkout/[orderId]/delivery',
            params: { orderId: quote.id },
          })
        }
      />
    </View>
  );
}
