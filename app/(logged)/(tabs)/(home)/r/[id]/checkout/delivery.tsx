import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextBusinessQuote } from '@/api/business/context/business-context';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { DeliveryAddress } from '@/common/screens/home/businesses/checkout/delivery/delivery-address';
import { FulfillmentSelector } from '@/common/screens/home/businesses/checkout/delivery/fulfillment-selector';
import { PreparationMode } from '@/common/screens/home/businesses/checkout/delivery/preparation-mode';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Stack, router } from 'expo-router';
import { useEffect } from 'react';

export default function OrderCheckoutDeliveryScreen() {
  // context
  const quote = useContextBusinessQuote();
  // tracking
  useTrackScreenView('Checkout: entrega');
  // side effects
  // go back when order becomes empty
  useEffect(() => {
    if (quote === null) router.replace('/(logged)/(tabs)/(home)/');
  }, [quote]);
  // UI
  if (!quote) return null;
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Entrega' }} />
      <DefaultView style={{ padding: paddings.lg }}>
        <FulfillmentSelector />
        <DeliveryAddress style={{ marginTop: paddings.xl }} order={quote} />
        <PreparationMode style={{ marginTop: paddings.xl }} order={quote} />
      </DefaultView>
    </DefaultScrollView>
  );
}
