import { NewPlaceComplement } from '@/common/screens/places/complement/complement';
import { useGlobalSearchParams } from 'expo-router';

export default function NewPlaceComplementScreen() {
  const { orderId } = useGlobalSearchParams<{ orderId: string }>();
  return <NewPlaceComplement returnScreen={`/checkout/${orderId}/delivery`} />;
}
