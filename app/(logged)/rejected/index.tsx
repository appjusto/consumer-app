import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextProfile } from '@/common/auth/AuthContext';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { FeedbackHeader } from '@/common/components/views/feedback-header';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { openWhatsAppSupportURL } from '@/common/constants/openWhatsAppSupportURL';
import colors from '@/common/styles/colors';
import lineHeight from '@/common/styles/lineHeight';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import crashlytics from '@react-native-firebase/crashlytics';
import { Stack, router, useGlobalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function SubmittedIndex() {
  // params
  const params = useGlobalSearchParams<{ uploaded: string }>();
  const uploaded = params.uploaded === 'true';
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  const profile = useContextProfile();
  // state
  // track
  useTrackScreenView(
    'Cadastro reprovado',
    { consumerId: profile?.id },
    profile?.situation === 'rejected'
  );
  // handlers
  const fixProfile = () => {
    api
      .profile()
      .fixProfile()
      .catch((error: unknown) => {
        console.error(error);
        if (error instanceof Error) crashlytics().recordError(error);
        showToast(
          'Não foi possível submeter seu cadastro. Entre em contato com nosso suporte.',
          'error'
        );
      });
  };
  // UI
  return (
    <View style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Cadastro', headerBackVisible: false }} />
      <DefaultScrollView>
        <FeedbackHeader
          title="Confirmação de identidade"
          text={
            uploaded
              ? ['Pronto! Agora basta confirmar e aguardar a validação']
              : ['Para garantir uma compra segura, precisamos confirmar sua identidade']
          }
          variant={uploaded ? 'success' : 'error'}
        />
        <View
          style={{
            flex: 1,
            paddingVertical: paddings['2xl'],
            paddingHorizontal: paddings.lg,
            backgroundColor: colors.neutral50,
          }}
        >
          <DefaultText size="lg">O que aconteceu?</DefaultText>
          <DefaultText style={{ marginTop: paddings.sm, ...lineHeight.md }} size="md">
            Nossos pedidos passam por uma triagem para garantir a segurança da plataforma. Para
            continuar, precisamos que você confirme sua identidade enviando a foto do seu RG e uma
            selfie sua.
          </DefaultText>
          <DefaultText style={{ marginTop: paddings.lg, ...lineHeight.md }} size="md">
            Se você tiver dúvidas, nosso time de atendimento está aqui pra te ajudar!
          </DefaultText>

          <View style={{ flex: 1 }} />
          <DefaultButton
            style={{ marginTop: paddings.lg }}
            title={uploaded ? 'Confirmar' : 'Enviar fotos'}
            onPress={() => {
              if (uploaded) fixProfile();
              else
                router.replace({
                  pathname: '/(logged)/rejected/images',
                });
            }}
          />

          <DefaultButton
            style={{ marginTop: paddings.md }}
            variant="outline"
            title="Falar com o suporte"
            onPress={() => openWhatsAppSupportURL('Cadastro reprovado')}
          />
        </View>
      </DefaultScrollView>
    </View>
  );
}
