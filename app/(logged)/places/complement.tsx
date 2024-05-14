import { NewPlaceComplement } from '@/common/screens/places/complement/complement';
import { useGlobalSearchParams } from 'expo-router';
import { isEmpty } from 'lodash';

export default function NewPlaceComplementScreen() {
  const params = useGlobalSearchParams<{ returnScreen?: string }>();
  const returnScreen = isEmpty(params.returnScreen)
    ? '/(logged)/(tabs)/(home)/'
    : (params.returnScreen as string);
  console.log('NewPlaceComplementScreen', returnScreen);
  return <NewPlaceComplement returnScreen={returnScreen} />;
}
