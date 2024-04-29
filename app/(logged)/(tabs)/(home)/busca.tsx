import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { SearchList } from '@/common/screens/home/businesses/list/search-list';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Stack } from 'expo-router';

export default function SearchScreen() {
  // tracking
  useTrackScreenView('Pesquisa');
  // UI
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Pesquisa' }} />
      <DefaultView style={{ padding: paddings.lg }}>
        <SearchList mode="search" />
      </DefaultView>
    </DefaultScrollView>
  );
}
