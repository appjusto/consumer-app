import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextBusinessQuote } from '@/api/business/context/business-context';
import { useOrderFares } from '@/api/business/fares/useOrderFares';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultInput } from '@/common/components/inputs/default/DefaultInput';
import { BusinessCart } from '@/common/screens/home/businesses/checkout/business-cart';
import { EmptyCart } from '@/common/screens/home/businesses/checkout/empty-cart';
import { OrderTotalBreakdown } from '@/common/screens/orders/breakdown/order-total-breakdown';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';

export default function OrderCheckoutScreen() {
  // context
  const api = useContextApi();
  const quote = useContextBusinessQuote();
  // state
  const fares = useOrderFares(quote, 'credit_card');
  const [additionalInfo, setAdditionalInfo] = useState('');
  // tracking
  useTrackScreenView('Checkout');
  // side effects
  useEffect(() => {
    if (!quote) return;
    if (!fares?.length) return;
    if (!quote?.fare) {
      api.orders().updateOrder(quote.id, { fare: fares[0] });
    }
  }, [api, fares, quote]);
  console.log('orderId', quote?.id);
  // UI
  if (!quote) return <EmptyCart />;
  return (
    <DefaultScrollView style={{ ...screens.default }}>
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
  );
}
