import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useObserveBusiness } from '@/api/business/useObserveBusiness';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { Loading } from '@/common/components/views/Loading';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function RestaurantScreen() {
  // params
  const params = useLocalSearchParams<{ id: string }>();
  const businessId = params.id;
  // state
  const business = useObserveBusiness(businessId);
  // tracking
  useTrackScreenView('');
  // UI
  if (!business) return <Loading />;
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <Stack.Screen options={{ title: '' }} />
      <DefaultView style={{ padding: paddings.lg }}>
        <DefaultText>{business.name}</DefaultText>
      </DefaultView>
    </DefaultScrollView>
  );
}
