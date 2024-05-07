import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextSetTemporaryPlace } from '@/api/preferences/context/PreferencesContext';
import { useContextIsUserAnonymous } from '@/common/auth/AuthContext';
import { DefaultKeyboardAwareScrollView } from '@/common/components/containers/DefaultKeyboardAwareScrollView';
import { safeRouteParams } from '@/common/routes/safeRouteParam';
import { PlaceDetail } from '@/common/screens/places/complement/place-detail';
import screens from '@/common/styles/screens';
import { Place } from '@appjusto/types';
import { router, useGlobalSearchParams } from 'expo-router';
import { isEmpty, trim } from 'lodash';
import { View } from 'lucide-react-native';
import { useState } from 'react';
import { Platform } from 'react-native';
import { ScreenTitle } from '../../title/screen-title';

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
  console.log(params);
  // context
  const api = useContextApi();
  const isAnonymous = useContextIsUserAnonymous();
  const setTemporaryPlace = useContextSetTemporaryPlace();
  // state
  const latlng = location ? location.split(',').map((v) => parseFloat(v)) : null;
  const place = latlng
    ? ({
        address: { description, main, secondary, googlePlaceId },
        location: { latitude: latlng[0], longitude: latlng[1] },
      } as Partial<Place>)
    : null;
  const [loading, setLoading] = useState(false);
  // tracking
  useTrackScreenView('Novo endereço: complemento');
  console.log('location', location);
  console.log('complement', params);
  // handlers
  const saveHandler = (additionalInfo: string, instructions: string) => {
    if (!place) return;
    const updatedPlace: Partial<Place> = {
      ...place,
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
  if (!place) return <ScreenTitle title="Complemento" />;

  return (
    <DefaultKeyboardAwareScrollView contentContainerStyle={Platform.select({ ios: { flex: 1 } })}>
      <View style={{ ...screens.default }}>
        <ScreenTitle title="Complemento" />
        <PlaceDetail place={place} onSave={saveHandler} />
      </View>
    </DefaultKeyboardAwareScrollView>
  );
};
