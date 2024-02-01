import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultMap } from '@/common/components/map/DefaultMap';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { LatLng } from '@appjusto/types';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

type Params = {
  main: string;
  secondary: string;
  description: string;
  googlePlaceId?: string;
  returnScreen: string;
};

export default function NewPlaceConfirmScreen() {
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
    setLocation(null);
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
      returnScreen: params.returnScreen,
    });
    router.navigate({
      pathname: '/places/complement',
      params: {
        description,
        main,
        secondary,
        googlePlaceId: googlePlaceId ?? '',
        location: `${location.latitude},${location.longitude}`,
        returnScreen: params.returnScreen,
      },
    });
  };
  // console.log('location', location);
  // UI

  if (location === undefined) return null;
  if (location === null) return null; // TODO: handle it
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      {/* <Stack.Screen
        options={{
          header: () =>
            temporaryPlace.address ? (
              <View
                style={{ ...screens.headless, flex: 0, padding: paddings.lg, alignItems: 'center' }}
              >
                <DefaultText size="md" color="black">
                  {temporaryPlace.address.main}
                </DefaultText>
                <DefaultText style={{ marginTop: paddings.xs }} size="sm" color="neutral700">
                  {temporaryPlace.address.secondary}
                </DefaultText>
              </View>
            ) : null,
        }}
      /> */}
      <Stack.Screen options={{ title: 'Confirmar endereço' }} />
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
}
