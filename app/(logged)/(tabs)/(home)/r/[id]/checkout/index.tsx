import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextBusinessQuote } from '@/api/business/context/business-context';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultInput } from '@/common/components/inputs/default/DefaultInput';
import { BusinessCart } from '@/common/screens/home/businesses/checkout/business-cart';
import { EmptyCart } from '@/common/screens/home/businesses/checkout/empty-cart';
import { CartButton } from '@/common/screens/home/businesses/detail/footer/cart-button';
import { OrderTotalBreakdown } from '@/common/screens/orders/breakdown/order-total-breakdown';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

export default function OrderCheckoutScreen() {
  // context
  const quote = useContextBusinessQuote();
  // state
  const [additionalInfo, setAdditionalInfo] = useState('');
  // tracking
  useTrackScreenView('Checkout: sacola');
  // go back when order becomes empty
  useEffect(() => {
    if (quote === null) router.replace('/(logged)/(tabs)/(home)/');
  }, [quote]);
  // logs
  // console.log('orderId', quote?.id);
  // UI
  if (!quote) return <EmptyCart />;
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
        <OrderTotalBreakdown order={quote} />
      </DefaultScrollView>
      <View style={{ flex: 1 }} />
      <CartButton variant="checkout" />
    </View>
  );
}
