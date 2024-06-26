import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { PlacesList } from '@/common/screens/places/list/places-list';
import { ScreenTitle } from '@/common/screens/title/screen-title';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Place, WithId } from '@appjusto/types';
import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function P2PPlaceSelect() {
  // params
  const params = useLocalSearchParams<{
    key: string;
    title: string;
  }>();
  // tracking
  useTrackScreenView('Encomendas: escolher');
  // handlers
  const selectPlaceHandler = (place: WithId<Place>) => {
    // console.log('selectPlaceHandler');
    // console.log({
    //   key: params.key,
    //   placeId: place.id,
    // });
    router.navigate({
      pathname: '/encomendas/new',
      params: {
        key: params.key,
        placeId: place.id,
      },
    });
  };
  const newPlaceHandler = () => {
    router.replace({
      pathname: `/encomendas/places/new`,
      params: {
        key: params.key,
      },
    });
  };
  // logs
  console.log('encomendas/places', params);
  const title = (() => {
    if (params.title) return params.title;
    return 'Seus endereços';
  })();
  // UI
  return (
    <View style={{ ...screens.default }}>
      <ScreenTitle title={title} />
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
