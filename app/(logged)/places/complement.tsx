import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextSetTemporaryPlace } from '@/api/preferences/context/PreferencesContext';
import { useContextIsUserAnonymous } from '@/common/auth/AuthContext';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { PlaceDetail } from '@/common/screens/places/detail/place-detail';
import screens from '@/common/styles/screens';
import { Place } from '@appjusto/types';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { isEmpty, trim } from 'lodash';
import { useState } from 'react';

type Params = {
  main: string;
  secondary: string;
  description: string;
  googlePlaceId?: string;
  location: string;
  returnScreen: string;
  orderId: string;
};

export default function NewPlaceComplementScreen() {
  // params
  const params = useLocalSearchParams<Params>();
  const { description, main, secondary, googlePlaceId = '', location, returnScreen } = params;

  // context
  const api = useContextApi();
  const showToast = useShowToast();
  const isAnonymous = useContextIsUserAnonymous();
  const setTemporaryPlace = useContextSetTemporaryPlace();
  // state
  const [loading, setLoading] = useState(false);
  const latlng = location.split(',').map((v) => parseFloat(v));
  const place: Partial<Place> = {
    address: { description, main, secondary, googlePlaceId },
    location: { latitude: latlng[0], longitude: latlng[1] },
  };
  // tracking
  useTrackScreenView('Novo endereço: complemento');
  // handlers
  const saveHandler = (additionalInfo: string, instructions: string) => {
    const updatedPlace: Partial<Place> = {
      ...place,
      additionalInfo: isEmpty(additionalInfo) ? null : additionalInfo,
      instructions: trim(instructions),
    };
    if (isAnonymous) {
      setTemporaryPlace(updatedPlace);
      router.replace('/(logged)/(tabs)/(home)/');
    } else {
      // @ts-ignore
      router.replace({
        pathname: returnScreen,
        params,
      });
    }
  };
  // UI
  if (!place) return null;
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Número' }} />
      <PlaceDetail place={place} loading={loading} onSave={saveHandler} />
    </DefaultScrollView>
  );
}
