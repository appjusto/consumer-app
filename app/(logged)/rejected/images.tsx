import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import ProfilePersonalImages from '@/common/screens/profile/images';

import screens from '@/common/styles/screens';
import { Stack, router } from 'expo-router';

export default function ProfileRejectedImagesScreen() {
  // context
  const api = useContextApi();
  // tracking
  useTrackScreenView('Cadastro reprovado: Selfie e documento');
  // handlers
  const updateHandler = () => {
    api
      .profile()
      .requestProfileChange({ images: true })
      .then(() => {
        router.replace({
          pathname: '/(logged)/rejected',
          params: { uploaded: 'true' },
        });
      });
  };
  // UI
  return (
    <DefaultView style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Selfie e documento' }} />
      <ProfilePersonalImages onUpdateProfile={updateHandler} />
    </DefaultView>
  );
}
