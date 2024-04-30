import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextProfile } from '@/common/auth/AuthContext';
import { CheckButton } from '@/common/components/buttons/check/CheckButton';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { LinkButton } from '@/common/components/buttons/link/LinkButton';
import { DefaultKeyboardAwareScrollView } from '@/common/components/containers/DefaultKeyboardAwareScrollView';
import { PatternInput } from '@/common/components/inputs/pattern/PatternInput';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { SignInIcon } from '@/common/screens/unlogged/sign-in/icon';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { isPhoneValid } from '@/common/validators/phone';
import { Stack, router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Platform, SafeAreaView, View, ViewProps } from 'react-native';

interface Props extends ViewProps {}

export const SignIn = ({ style, ...props }: Props) => {
  // context
  const profile = useContextProfile();
  const situation = profile?.situation;
  // state
  const [phone, setPhone] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const canSubmit = termsAccepted && isPhoneValid(phone);
  // side effects
  useFocusEffect(
    useCallback(() => {
      if (situation === 'approved') {
        router.back();
      }
    }, [situation])
  );
  // track
  useTrackScreenView('Login');
  // UI
  return (
    <DefaultKeyboardAwareScrollView contentContainerStyle={Platform.select({ ios: { flex: 1 } })}>
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Stack.Screen options={{ title: 'Entrar' }} />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.neutral50,
            padding: 50,
          }}
        >
          <SignInIcon />
        </View>
        <View style={{ flex: 1, padding: paddings.lg }}>
          <View style={{ flex: 1 }} />
          <DefaultText size="lg" style={{ marginVertical: paddings.xl }}>
            Acesse ou crie uma conta
          </DefaultText>
          <PatternInput
            pattern="phone"
            title="Celular"
            placeholder="Número com DDD"
            keyboardType="number-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              // borderWidth: 1,
            }}
          >
            <DefaultText size="sm" color="neutral800" style={{ marginTop: paddings.xs }}>
              Digite o número do seu celular
            </DefaultText>
            <LinkButton onPress={() => router.push('/(unlogged)/terms')}>Ler termos</LinkButton>
          </View>
          <CheckButton
            title="Li e aceito os termos"
            checked={termsAccepted}
            style={{ marginVertical: paddings.lg }}
            onPress={() => setTermsAccepted((value) => !value)}
          />

          <View style={{ flex: 1 }} />
          <SafeAreaView>
            <DefaultButton
              title="Entrar"
              disabled={!canSubmit}
              style={{ marginBottom: paddings.xl }}
              onPress={() => {
                router.push({
                  pathname: '/(logged)/(tabs)/(home)/phone-verification',
                  params: { phone, countryCode: 55 },
                });
              }}
            />
          </SafeAreaView>
        </View>
      </View>
    </DefaultKeyboardAwareScrollView>
  );
};
