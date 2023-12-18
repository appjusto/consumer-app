import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import {
  useContextSetTemporaryPlace,
  useContextTemporaryPlace,
} from '@/api/preferences/context/PreferencesContext';
import { useContextIsUserAnonymous } from '@/common/auth/AuthContext';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { PlaceDetail } from '@/common/screens/places/detail/place-detail';
import screens from '@/common/styles/screens';
import { Place } from '@appjusto/types';
import { Stack, router } from 'expo-router';
import { isEmpty, trim } from 'lodash';
import { useState } from 'react';

export default function NewPlaceComplementScreen() {
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  const isAnonymous = useContextIsUserAnonymous();
  const temporaryPlace = useContextTemporaryPlace();
  const setTemporaryPlace = useContextSetTemporaryPlace();
  // state
  const [loading, setLoading] = useState(false);
  // tracking
  useTrackScreenView('Novo endereço: complemento');
  // handlers
  const saveHandler = (additionalInfo: string, instructions: string) => {
    const updatedPlace: Partial<Place> = {
      ...temporaryPlace,
      additionalInfo: isEmpty(additionalInfo) ? null : additionalInfo,
      instructions: trim(instructions),
    };
    if (isAnonymous) {
      setTemporaryPlace(updatedPlace);
      router.replace('/(logged)/(tabs)/(home)/');
    } else {
      setLoading(true);
      api
        .consumers()
        .createPlace(updatedPlace)
        .then(() => setLoading(false))
        .catch((error) => {
          console.log(error);
          showToast('Não foi possível salvar seu endereço. Tente novamente.', 'error');
          setLoading(false);
        });
    }
  };
  // UI
  if (!temporaryPlace) return null;
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Número' }} />
      <PlaceDetail place={temporaryPlace} loading={loading} onSave={saveHandler} />
    </DefaultScrollView>
  );
}
