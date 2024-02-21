import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { PlacesList } from '@/common/screens/places/list/places-list';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Place, WithId } from '@appjusto/types';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function P2PPlaceSelect() {
  // params
  const params = useLocalSearchParams<{
    key: string;
  }>();
  // tracking
  useTrackScreenView('Encomendas: escolher');
  // handlers
  const selectPlaceHandler = (place: WithId<Place>) => {
    console.log('selectPlaceHandler');
    console.log({
      key: params.key,
      placeId: place.id,
    });
    router.navigate({
      pathname: '/encomendas/new',
      params: {
        key: params.key,
        placeId: place.id,
      },
    });
  };
  const newPlaceHandler = () => {
    console.log('newPlaceHandler');
    router.replace({
      pathname: `/encomendas/places/new`,
    });
  };
  // logs
  console.log('encomendas/places', params);
  // UI
  return (
    <View style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Seus endereços' }} />
      <DefaultScrollView>
        <DefaultView style={{ padding: paddings.lg }}>
          <PlacesList onSelect={selectPlaceHandler} />
        </DefaultView>
      </DefaultScrollView>
      <View>
        <View
          style={{ padding: paddings.lg, flexDirection: 'row', justifyContent: 'space-between' }}
        >
          <View style={{ flex: 1 }}>
            <DefaultButton title="Novo endereço" onPress={newPlaceHandler} />
          </View>
        </View>
      </View>
    </View>
  );
}
