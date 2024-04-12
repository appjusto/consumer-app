import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextSetTemporaryPlace } from '@/api/preferences/context/PreferencesContext';
import { useContextIsUserAnonymous } from '@/common/auth/AuthContext';
import { DefaultKeyboardAwareScrollView } from '@/common/components/containers/DefaultKeyboardAwareScrollView';
import { safeRouteParams } from '@/common/routes/safeRouteParam';
import { PlaceDetail } from '@/common/screens/places/complement/place-detail';
import screens from '@/common/styles/screens';
import { Place } from '@appjusto/types';
import { Stack, router, useGlobalSearchParams } from 'expo-router';
import { isEmpty, trim } from 'lodash';
import { useState } from 'react';

type Params = {
  main: string;
  secondary: string;
  description: string;
  googlePlaceId?: string;
  location: string;
  key?: string;
};

interface Props {
  returnScreen: string;
}

export const NewPlaceComplement = ({ returnScreen }: Props) => {
  // params
  const params = useGlobalSearchParams<Params>();
  const { description, main, secondary, googlePlaceId = '', location } = params;
  // context
  const api = useContextApi();
  const isAnonymous = useContextIsUserAnonymous();
  const setTemporaryPlace = useContextSetTemporaryPlace();
  // state
  const latlng = location.split(',').map((v) => parseFloat(v));
  const place: Partial<Place> = {
    address: { description, main, secondary, googlePlaceId },
    location: { latitude: latlng[0], longitude: latlng[1] },
  };
  const [loading, setLoading] = useState(false);
  // tracking
  useTrackScreenView('Novo endereço: complemento');
  console.log('complement', params);
  // handlers
  const saveHandler = (additionalInfo: string, instructions: string) => {
    const updatedPlace: Partial<Place> = {
      ...place,
      additionalInfo: isEmpty(additionalInfo) ? null : additionalInfo,
      instructions: trim(instructions),
    };
    if (isAnonymous) {
      setTemporaryPlace(updatedPlace);
      router.replace('/');
    } else {
      setLoading(true);
      api
        .consumers()
        .createPlace(updatedPlace)
        .then((id) => {
          if (returnScreen) {
            router.navigate({
              pathname: returnScreen,
              params: safeRouteParams({
                key: params.key ?? '',
                placeId: id,
              }),
            });
          } else {
            router.back();
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };
  // UI
  if (!place) return null;
  return (
    <DefaultKeyboardAwareScrollView contentContainerStyle={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Complemento' }} />
      <PlaceDetail place={place} onSave={saveHandler} />
    </DefaultKeyboardAwareScrollView>
  );
};
