import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
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
    <DefaultView style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Pesquisa' }} />
      <DefaultView style={{ flex: 1, padding: paddings.lg }}>
        <SearchList mode="search" />
      </DefaultView>
    </DefaultView>
  );
}
