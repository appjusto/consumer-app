import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultMap } from '@/common/components/map/DefaultMap';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { safeRouteParams } from '@/common/routes/safeRouteParam';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { LatLng } from '@appjusto/types';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { ScreenTitle } from '../title/screen-title';

type Params = {
  main: string;
  secondary: string;
  description: string;
  googlePlaceId?: string;
  key?: string;
};

interface Props {
  basePathname: string;
}

export const NewPlaceConfirm = ({ basePathname }: Props) => {
  // params
  const params = useLocalSearchParams<Params>();
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  // state
  const [description, setDescription] = useState(params.description);
  const [main, setMain] = useState(params.main);
  const [secondary, setSecondary] = useState(params.secondary);
  const [googlePlaceId, setGooglePlaceId] = useState(params.googlePlaceId);
  const [location, setLocation] = useState<LatLng | null>();
  // tracking
  useTrackScreenView('Novo endereço: confirmar');
  // side effects
  useFocusEffect(
    useCallback(() => {
      if (location === null) router.back();
    }, [location])
  );
  useEffect(() => {
    if (!description) {
      showToast('Não foi possível validar seu endereço. Tente novamente.', 'error');
      router.back();
    } else {
      api
        .maps()
        .googleGeocode(description)
        .then(setLocation)
        .catch((error) => {
          console.info(error);
          showToast('Não foi possível validar seu endereço. Tente novamente.', 'error');
          setLocation(null);
          router.back();
        });
    }
  }, [api, showToast, description]);
  // handlers
  const googleReverseGeocode = (value: LatLng) => {
    api
      .maps()
      .googleReverseGeocode(value)
      .then((address) => {
        if (address) {
          setDescription(address.description);
          setMain(address.main);
          setSecondary(address.secondary);
          setGooglePlaceId(address.googlePlaceId);
        }
      })
      .catch((error) => {
        console.info(error);
      });
  };
  const confirmHandler = () => {
    if (!location) return;
    console.log('confirm', {
      description,
      main,
      secondary,
      googlePlaceId: googlePlaceId ?? '',
      location: `${location.latitude},${location.longitude}`,
    });
    router.navigate({
      pathname: `${basePathname}/places/complement`,
      params: safeRouteParams({
        key: params.key ?? '',
        description,
        main,
        secondary,
        googlePlaceId: googlePlaceId ?? '',
        location: `${location.latitude},${location.longitude}`,
      }),
    });
  };
  // console.log('location', location);
  // UI
  if (!location) return <ScreenTitle title="Confirmar endereço" />;
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <ScreenTitle title="Confirmar endereço" />
      <View style={{ padding: paddings.lg, alignItems: 'center' }}>
        <DefaultText size="md" color="black">
          {main}
        </DefaultText>
        <DefaultText style={{ marginTop: paddings.xs }} size="sm" color="neutral700">
          {secondary}
        </DefaultText>
      </View>
      <DefaultMap
        location={location}
        locationColor="primary900"
        onLocationUpdate={(value) => {
          setLocation(value);
          googleReverseGeocode(value);
        }}
      />
      <DefaultButton
        style={{ position: 'absolute', left: paddings.lg, bottom: paddings.xl, right: paddings.lg }}
        title="Confirmar"
        disabled={!location}
        onPress={confirmHandler}
      />
    </DefaultScrollView>
  );
};
