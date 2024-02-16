import { NewPlace } from '@/common/screens/places/new';
import { useGlobalSearchParams } from 'expo-router';

export default function NewPlaceScreen() {
  const { orderId } = useGlobalSearchParams<{ orderId: string }>();
  return <NewPlace basePathname={`/checkout/${orderId}`} />;
}
