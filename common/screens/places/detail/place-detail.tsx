import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { DefaultInput } from '@/common/components/inputs/default/DefaultInput';
import { DefaultMap } from '@/common/components/map/DefaultMap';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import paddings from '@/common/styles/paddings';
import { Place } from '@appjusto/types';
import crashlytics from '@react-native-firebase/crashlytics';
import { useEffect, useState } from 'react';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  place: Partial<Place>;
  loading: boolean;
  onSave: (additionalInfo: string, instructions: string) => void;
}

export const PlaceDetail = ({ place, loading, onSave, style, ...props }: Props) => {
  // context
  const showToast = useShowToast();
  // state
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [instructions, setInstructions] = useState('');
  // side effects
  // error handling
  useEffect(() => {
    console.log('temporaryPlace', place);
    if (!place?.location) {
      showToast('Não foi possível obter sua localização. Tente novamente.', 'error');
      crashlytics().recordError(
        new Error('Tela de complemento: não foi possível obter a localização')
      );
    }
  }, [showToast, place]);
  // UI
  if (!place?.location) return null;
  if (!place?.address) return null;
  return (
    <View style={[{}, style]} {...props}>
      <DefaultMap location={place.location} locationColor="primary900" />
      <View style={{ marginTop: paddings.sm, padding: paddings.lg }}>
        <DefaultText size="lg" color="black">
          {place.address.main}
        </DefaultText>
        <DefaultText style={{ marginTop: paddings.xs }} size="md" color="neutral800">
          {place.address.secondary}
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
          onPress={() => onSave(additionalInfo, instructions)}
        />
      </DefaultView>
    </View>
  );
};
