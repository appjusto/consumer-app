import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import screens from '@/common/styles/screens';

export default function ProfileScreen() {
  // tracking
  useTrackScreenView('Sua conta');
  // UI
  return <DefaultScrollView style={{ ...screens.default }}></DefaultScrollView>;
}
