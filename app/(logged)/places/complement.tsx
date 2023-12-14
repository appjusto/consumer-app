import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import {
  useContextSetTemporaryPlace,
  useContextTemporaryPlace,
} from '@/api/preferences/context/PreferencesContext';
import { useContextIsUserAnonymous } from '@/common/auth/AuthContext';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { DefaultInput } from '@/common/components/inputs/default/DefaultInput';
import { DefaultMap } from '@/common/components/map/DefaultMap';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Place } from '@appjusto/types';
import crashlytics from '@react-native-firebase/crashlytics';
import { Stack, router } from 'expo-router';
import { isEmpty, trim } from 'lodash';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

export default function NewPlacNumberScreen() {
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  const isAnonymous = useContextIsUserAnonymous();
  const temporaryPlace = useContextTemporaryPlace();
  const setTemporaryPlace = useContextSetTemporaryPlace();
  // state
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  // side effects
  // error handling
  useEffect(() => {
    console.log('temporaryPlace', temporaryPlace);
    if (!temporaryPlace?.location) {
      showToast('Não foi possível obter sua localização. Tente novamente.', 'error');
      crashlytics().recordError(
        new Error('Tela de complemento: não foi possível obter a localização')
      );
      // router.replace('/(logged)/(tabs)/(home)/');
    }
  }, [showToast, temporaryPlace]);
  // tracking
  useTrackScreenView('Novo endereço: complemento');
  // handlers
  const confirmHandler = () => {
    const place: Partial<Place> = {
      ...temporaryPlace,
      additionalInfo: isEmpty(additionalInfo) ? null : additionalInfo,
      instructions: trim(instructions),
    };
    if (isAnonymous) {
      setTemporaryPlace(place);
      router.replace('/(logged)/(tabs)/(home)/');
    } else {
      setLoading(true);
      api
        .consumers()
        .createPlace(place)
        .then(() => setLoading(false))
        .catch((error) => {
          console.log(error);
          showToast('Não foi possível salvar seu endereço. Tente novamente.', 'error');
          setLoading(false);
        });
    }
  };
  if (!temporaryPlace?.location) return null;
  if (!temporaryPlace?.address) return null;
  // UI
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Número' }} />
      <DefaultMap location={temporaryPlace.location} locationColor="primary900" />
      <View style={{ marginTop: paddings.sm, padding: paddings.lg }}>
        <DefaultText size="lg" color="black">
          {temporaryPlace.address.main}
        </DefaultText>
        <DefaultText style={{ marginTop: paddings.xs }} size="md" color="neutral800">
          {temporaryPlace.address.secondary}
        </DefaultText>
      </View>
      <DefaultView style={{ flex: 1, marginTop: paddings.sm, padding: paddings.lg }}>
        <DefaultInput
          title="Complemento"
          placeholder="Apto, bloco, casa, etc."
          value={additionalInfo}
          onChangeText={setAdditionalInfo}
        />
        <DefaultInput
          title="Observações"
          style={{ marginTop: paddings.lg }}
          placeholder="Alguma observação ou ponto de referência"
          value={instructions}
          onChangeText={setInstructions}
        />
        <View style={{ flex: 1 }} />
        <DefaultButton
          title="Salvar endereço"
          disabled={loading}
          loading={loading}
          onPress={confirmHandler}
        />
      </DefaultView>
    </DefaultScrollView>
  );
}
