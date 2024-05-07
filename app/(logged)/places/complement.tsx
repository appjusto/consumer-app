import { NewPlaceComplement } from '@/common/screens/places/complement/complement';
import { useGlobalSearchParams } from 'expo-router';

export default function NewPlaceComplementScreen() {
  const params = useGlobalSearchParams<{ returnScreen?: string }>();
  const returnScreen = params.returnScreen ?? '/(logged)/(tabs)/(home)/';
  return <NewPlaceComplement returnScreen={returnScreen} />;
}
