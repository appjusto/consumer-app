import { useContextApi } from '@/api/ApiContext';
import { PickImageFrom, pickImage } from '@/api/files/pickImage';
import { useStorageFile } from '@/api/storage/useStorageFile';
import { useContextProfile } from '@/common/auth/AuthContext';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { PendingStep } from '@/common/components/pending/PendingStep';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { Loading } from '@/common/components/views/Loading';
import { RoundedImageBox } from '@/common/components/views/images/rounded/RoundedImageBox';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { handleErrorMessage } from '@/common/firebase/errors';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { onSimulator } from '@/common/version/device';
import { useActionSheet } from '@expo/react-native-action-sheet';
import crashlytics from '@react-native-firebase/crashlytics';
import { useCameraPermissions, useMediaLibraryPermissions } from 'expo-image-picker';
import { Upload } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

type ImageType = 'selfie' | 'document';

interface Props {
  onUpdateProfile?: () => void;
}

export default function ProfilePersonalImages({ onUpdateProfile }: Props) {
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  const profile = useContextProfile();
  const consumerId = profile?.id;
  const { showActionSheetWithOptions } = useActionSheet();
  // state
  const [cameraPermissionStatus, requestCameraPermission] = useCameraPermissions();
  const [mediaPermissionStatus, requestMediaPermission] = useMediaLibraryPermissions();
  const size = '1024';
  const [selfieBase64, setSelfieBase64] = useState('');
  const [documentBase64, setDocumentBase64] = useState('');
  const {
    downloadURL: selfieUrl,
    loading: loadingSelfie,
    upload: uploadSelfie,
  } = useStorageFile(consumerId ? api.profile().getSelfiePath(size) : undefined);
  const {
    downloadURL: documentUrl,
    loading: loadingDocument,
    upload: uploadDocument,
  } = useStorageFile(consumerId ? api.profile().getDocumentPath(size) : undefined);
  // helpers

  // const canUploadImages = getEnv() !== 'live' || courier?.situation !== 'approved';
  // handlers
  const handleError = (error: unknown) => {
    if (error instanceof Error) crashlytics().recordError(error);
    const message = handleErrorMessage(error);
    showToast(message, 'error');
  };
  const pickAndUpload = async (from: PickImageFrom, type: ImageType, aspect: [number, number]) => {
    if (!consumerId) return;
    try {
      if (onSimulator()) {
        if (!mediaPermissionStatus?.granted) {
          const status = await requestMediaPermission();
          if (!status.granted) {
            showToast('Você precisa permitir o acesso à suas mídias.', 'error');
            return;
          }
        }
      } else {
        if (!cameraPermissionStatus?.granted) {
          const status = await requestCameraPermission();
          if (!status.granted) {
            showToast('Você precisa permitir o acesso à câmera para tirar foto.', 'error');
            return;
          }
        }
      }
      const { uri, base64 } = await pickImage(from, aspect);
      if (uri === null) return;
      if (uri === undefined) {
        handleError(new Error('Não foi possível obter a imagem. Verifique as permissões.'));
        return;
      }
      if (type === 'selfie') {
        if (base64) setSelfieBase64(base64);
        await uploadSelfie(uri);
      } else if (type === 'document') {
        if (base64) setDocumentBase64(base64);
        await uploadDocument(uri);
      }
    } catch (error) {
      handleError(error);
    }
  };
  const actionSheetHandler = (type: ImageType, aspect: [number, number]) => {
    showActionSheetWithOptions(
      {
        options: ['Tirar uma foto', 'Escolher da galeria', 'Cancelar'],
        cancelButtonIndex: 2,
      },
      async (buttonIndex) => {
        if (buttonIndex === 0) await pickAndUpload('camera', type, aspect);
        else if (buttonIndex === 1) await pickAndUpload('gallery', type, aspect);
      }
    );
  };
  // UI
  const title = 'Selfie e documento';
  if (selfieUrl === undefined || documentUrl === undefined) {
    return <Loading backgroundColor="neutral50" title={title} />;
  }
  return (
    <DefaultScrollView style={{ ...screens.default, padding: paddings.lg }}>
      <DefaultText size="lg">
        {profile?.situation === 'approved'
          ? 'Selfie e documento'
          : 'Tire foto do seu rosto e documento'}
      </DefaultText>
      <View style={{ flex: 1, marginTop: paddings.lg }}>
        <PendingStep
          index={0}
          title="Foto de rosto"
          variant={selfieUrl ? 'past' : 'next'}
          icon="check"
        />
        <RoundedImageBox
          url={selfieBase64 ? `data:image/jpg;base64,${selfieBase64}` : selfieUrl}
          loading={loadingSelfie}
          onPress={() => actionSheetHandler('selfie', [1, 1])}
        >
          <Upload color={colors.neutral800} />
        </RoundedImageBox>
        <PendingStep
          index={1}
          title="RG ou CNH aberta"
          variant={documentUrl ? 'past' : 'next'}
          icon="check"
        />
        <RoundedImageBox
          url={documentBase64 ? `data:image/jpg;base64,${documentBase64}` : documentUrl}
          loading={loadingDocument}
          onPress={() => actionSheetHandler('document', [8.5, 12])}
        >
          <Upload color={colors.neutral800} />
        </RoundedImageBox>
      </View>

      <View style={{ flex: 1 }} />
      <DefaultButton
        style={{ marginTop: paddings.lg, marginBottom: paddings.xl }}
        title="Salvar e avançar"
        disabled={!selfieUrl || !documentUrl}
        onPress={() => {
          if (onUpdateProfile) onUpdateProfile();
        }}
      />
    </DefaultScrollView>
  );
}
