import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextBusinessQuote } from '@/api/business/context/business-context';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { BusinessCart } from '@/common/screens/home/businesses/checkout/business-cart';
import { EmptyCart } from '@/common/screens/home/businesses/checkout/empty-cart';
import screens from '@/common/styles/screens';
import { Stack } from 'expo-router';

export default function OrderCheckoutScreen() {
  // context
  const quote = useContextBusinessQuote();
  // tracking
  useTrackScreenView('Checkout');
  // UI
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Sua sacola' }} />
      {quote === null ? <EmptyCart /> : <BusinessCart />}
    </DefaultScrollView>
  );
}
