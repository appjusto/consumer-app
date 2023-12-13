import { BusinessProvider } from '@/api/business/context/business-context';
import { OrderProvider } from '@/api/orders/context/order-context';
import { Stack, useLocalSearchParams } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '/',
};

export default function BusinessLayout() {
  // params
  const params = useLocalSearchParams<{ id: string }>();
  const businessId = params.id;
  // logs
  console.log('_layout', businessId);
  // UI
  return (
    <BusinessProvider businessId={businessId}>
      <OrderProvider businessId={businessId}>
        <Stack />
      </OrderProvider>
    </BusinessProvider>
  );
}
