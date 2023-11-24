import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import {
  useContextTemporaryPlace,
  useContextUpdateTemporaryPlace,
} from '@/api/preferences/context/PreferencesContext';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultMap } from '@/common/components/map/DefaultMap';
import { DefaultText } from '@/common/components/texts/DefaultText';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { LatLng } from '@appjusto/types';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

export default function ConfirmNewPlaceScreen() {
  // context
  const api = useContextApi();
  const temporaryPlace = useContextTemporaryPlace();
  const updateTemporaryPlace = useContextUpdateTemporaryPlace();
  // state
  const [location, setLocation] = useState<LatLng | null>();
  // tracking
  useTrackScreenView('Novo endereço: confirmar');
  // side effects
  useEffect(() => {
    if (!temporaryPlace?.address) return;
    if (location) return;
    api
      .maps()
      .googleGeocode(temporaryPlace.address.description)
      .then(setLocation)
      .catch((error) => {
        console.info(error);
        setLocation(null);
      });
  }, [api, temporaryPlace, location]);
  // handlers
  const googleReverseGeocode = (value: LatLng) => {
    if (!temporaryPlace) return;
    setLocation(null);
    api
      .maps()
      .googleReverseGeocode(value)
      .then((address) => {
        if (address) {
          updateTemporaryPlace({ ...temporaryPlace, address });
        }
      })
      .catch((error) => {
        console.info(error);
      });
  };
  const confirmHandler = () => {
    if (!location) return;
    updateTemporaryPlace({ ...temporaryPlace, location });
    router.push('/places/complement');
  };
  // UI
  if (!temporaryPlace?.address) return null;
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
          {temporaryPlace.address.main}
        </DefaultText>
        <DefaultText style={{ marginTop: paddings.xs }} size="sm" color="neutral700">
          {temporaryPlace.address.secondary}
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
