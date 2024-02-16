import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextSetTemporaryPlace } from '@/api/preferences/context/PreferencesContext';
import { useContextIsUserAnonymous } from '@/common/auth/AuthContext';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { safeRouteParams } from '@/common/routes/safeRouteParam';
import { PlaceDetail } from '@/common/screens/places/complement/place-detail';
import screens from '@/common/styles/screens';
import { Place } from '@appjusto/types';
import { Stack, router, useGlobalSearchParams } from 'expo-router';
import { isEmpty, trim } from 'lodash';

type Params = {
  main: string;
  secondary: string;
  description: string;
  googlePlaceId?: string;
  location: string;
};

interface Props {
  returnScreen: string;
}

export const NewPlaceComplement = ({ returnScreen }: Props) => {
  // params
  const params = useGlobalSearchParams<Params>();
  const { description, main, secondary, googlePlaceId = '', location } = params;
  // context
  const isAnonymous = useContextIsUserAnonymous();
  const setTemporaryPlace = useContextSetTemporaryPlace();
  // state
  const latlng = location.split(',').map((v) => parseFloat(v));
  const place: Partial<Place> = {
    address: { description, main, secondary, googlePlaceId },
    location: { latitude: latlng[0], longitude: latlng[1] },
  };
  // tracking
  useTrackScreenView('Novo endereço: complemento');
  console.log('complement', params);
  // handlers
  const saveHandler = (additionalInfo: string, instructions: string) => {
    if (isAnonymous) {
      const updatedPlace: Partial<Place> = {
        ...place,
        additionalInfo: isEmpty(additionalInfo) ? null : additionalInfo,
        instructions: trim(instructions),
      };
      setTemporaryPlace(updatedPlace);
      router.replace('/');
    } else if (returnScreen) {
      router.navigate({
        pathname: returnScreen,
        params: safeRouteParams({
          description,
          main,
          secondary,
          googlePlaceId,
          location,
          additionalInfo,
          instructions,
        }),
      });
    }
  };
  // UI
  if (!place) return null;
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Complemento' }} />
      <PlaceDetail place={place} onSave={saveHandler} />
    </DefaultScrollView>
  );
};
