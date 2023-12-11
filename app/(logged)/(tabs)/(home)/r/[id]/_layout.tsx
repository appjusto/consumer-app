import { BusinessProvider } from '@/api/business/context/business-context';
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
      <Stack />
    </BusinessProvider>
  );
}
