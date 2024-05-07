import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useLocation } from '@/api/location/useLocation';
import { CheckButton } from '@/common/components/buttons/check/CheckButton';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { DefaultInput } from '@/common/components/inputs/default/DefaultInput';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { safeRouteParams } from '@/common/routes/safeRouteParam';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import crashlytics from '@react-native-firebase/crashlytics';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';

type Params = {
  sessionToken: string;
  main: string;
  secondary: string;
  description: string;
  googlePlaceId?: string;
  key?: string;
  returnScreen?: string;
};

interface Props {
  basePathname: string;
}

export const NewPlaceNumber = ({ basePathname }: Props) => {
  // params
  const {
    sessionToken,
    description,
    main,
    secondary,
    googlePlaceId = '',
    key = '',
    returnScreen = '',
  } = useLocalSearchParams<Params>();
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  // refs
  const numberRef = useRef<TextInput>(null);
  // state
  const [number, setNumber] = useState('');
  const [withoutNumber, setWithoutNumber] = useState(false);
  const [loading, setLoading] = useState(false);
  const { location } = useLocation();
  // side effects
  useEffect(() => {
    if (!main) {
      showToast('Não foi possível validar seu endereço. Tente novamente.', 'error');
      router.back();
    }
  }, [main, showToast]);
  useEffect(() => {
    if (withoutNumber) setNumber('');
  }, [withoutNumber]);
  // tracking
  useTrackScreenView('Novo endereço: número');
  // handlers
  const confirmHandler = () => {
    if (!main) return;
    if (!confirmEnabled) return;
    if (withoutNumber) {
      router.navigate({
        pathname: `${basePathname}/places/confirm`,
        params: safeRouteParams({ description, main, secondary, googlePlaceId, key, returnScreen }),
      });
    } else {
      if (!number) return;
      setLoading(true);
      api
        .maps()
        .googlePlacesAutocomplete(`${main} ${number}`, sessionToken, location)
        .then((addresses) => {
          setLoading(false);
          const firstAddress = addresses.find(() => true);
          if (!firstAddress) {
            showToast('Não foi possível validar seu endereço. Tente novamente.', 'error');
          } else {
            router.navigate({
              pathname: '/places/confirm',
              params: safeRouteParams({ ...firstAddress, key }),
            });
          }
        })
        .catch((error) => {
          console.info(error);
          if (error instanceof Error) crashlytics().recordError(error);
          setLoading(false);
          showToast('Não foi possível validar seu endereço. Tente novamente.', 'error');
        });
    }
  };
  // UI
  const confirmEnabled = main && (withoutNumber || number);
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <DefaultView style={{ padding: paddings.lg }}>
        <DefaultText size="lg">Informe o número do endereço</DefaultText>
        <DefaultInput
          ref={numberRef}
          style={{ marginTop: paddings.lg }}
          placeholder="Número do prédio ou casa"
          value={number}
          keyboardType="number-pad"
          returnKeyType="done"
          editable={!withoutNumber}
          onChangeText={setNumber}
        />
        <CheckButton
          title="Endereço sem número"
          checked={withoutNumber}
          style={{ marginVertical: paddings.lg }}
          onPress={() => setWithoutNumber((value) => !value)}
        />
        <View style={{ flex: 1 }} />
        <DefaultButton
          title={`Buscar ${withoutNumber ? 'sem' : 'com'} número`}
          disabled={!confirmEnabled || loading}
          loading={loading}
          onPress={confirmHandler}
        />
      </DefaultView>
    </DefaultScrollView>
  );
};
