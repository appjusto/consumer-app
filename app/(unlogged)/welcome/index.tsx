import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextUpdateLocationEnabled } from '@/api/preferences/context/PreferencesContext';
import { ArrowRightIconButton } from '@/common/components/buttons/icon/ArrowRightIconButton';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { BulletsSteps } from '@/common/screens/unlogged/welcome/BulletsSteps';
import { WelcomeStep1Image } from '@/common/screens/unlogged/welcome/images/WelcomeStep1Image';
import { WelcomeStep2Image } from '@/common/screens/unlogged/welcome/images/WelcomeStep2Image';
import { WelcomeStep4Image } from '@/common/screens/unlogged/welcome/images/WelcomeStep4Image';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Stack, router } from 'expo-router';
import { useRef, useState } from 'react';
import { View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { WelcomeStep } from '../../../common/screens/unlogged/welcome/WelcomeStep';

export default function Welcome() {
  // context
  const updateLocationEnabled = useContextUpdateLocationEnabled();
  // refs
  const pagerViewRef = useRef<PagerView>(null);
  // state
  const [step, setStep] = useState(0);
  const steps = 3;
  // track
  useTrackScreenView('Boas vindas');
  // UI
  return (
    <View style={{ ...screens.default }}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.neutral50 },
          headerTitle: () => (
            <DefaultText style={{ marginTop: 0, textAlign: 'center' }} size="md-body-app" bold>
              appjusto
            </DefaultText>
          ),
          headerShadowVisible: false,
        }}
      />
      <PagerView
        ref={pagerViewRef}
        style={{ flex: 1 }}
        onPageScroll={(event) => {
          const { nativeEvent } = event;
          const { position } = nativeEvent;
          if (position !== step) setStep(position);
        }}
      >
        <WelcomeStep
          icon={<WelcomeStep1Image />}
          header={['Só é bom quando é bom pra todos']}
          text={[
            'O appjusto é um negócio social que cobra taxas baixas do restaurantes para que eles não precisem aumentar seus preços no delivery.',
            'Você paga menos pela sua comida e ainda valoriza o trabalho de quem está fazendo sua entrega',
          ]}
          key="1"
        />
        <WelcomeStep
          icon={<WelcomeStep4Image />}
          header={['A melhor plataforma para quem entrega']}
          text={[
            'No appjusto o valor mínimo por corrida é R$ 10 e o valor fica liberado em no máximo 1 dia após a entrega.',
            'Através das frotas, as pessoas quem entregam podem se juntar e definir suas condições de trabalho, inclusive o valor da corrida!',
          ]}
          key="2"
        />
        <WelcomeStep
          icon={<WelcomeStep2Image />}
          header={['Todos contra o monopólio.']}
          text={[
            'O monopólio prejudica a todos. Restaurantes e pessoas que entregam precisam se sujeitar às taxas abusivas e, no final, fica mais caro para quem pede.',
            'Peça no appjusto e chame seu restaurante favorito para fazer parte!',
          ]}
          key="3"
        />
      </PagerView>
      <View style={{ padding: paddings.lg, marginBottom: paddings.lg }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <DefaultText size="xs">{`Passo ${step + 1} de ${steps}`}</DefaultText>
            <BulletsSteps size={steps} index={step} style={{ marginLeft: paddings.lg }} />
          </View>
          <ArrowRightIconButton
            onPress={() => {
              if (step + 1 < steps) {
                pagerViewRef?.current?.setPage(step + 1);
              } else {
                updateLocationEnabled(true);
                router.replace('/(logged)/(tabs)/(home)/');
              }
            }}
          />
        </View>
      </View>
    </View>
  );
}
