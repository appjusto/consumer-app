import { NewPlaceNumber } from '@/common/screens/places/number';
import { useGlobalSearchParams } from 'expo-router';

export default function NewPlaceNumberScreen() {
  const { orderId } = useGlobalSearchParams<{ orderId: string }>();
  return <NewPlaceNumber basePathname={`/checkout/${orderId}`} />;
}
