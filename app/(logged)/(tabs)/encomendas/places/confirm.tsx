import { NewPlaceConfirm } from '@/common/screens/places/confirm';
import { useGlobalSearchParams } from 'expo-router';

export default function NewPlaceConfirmScreen() {
  const { orderId } = useGlobalSearchParams<{ orderId: string }>();
  return <NewPlaceConfirm basePathname={`/checkout/${orderId}`} />;
}
