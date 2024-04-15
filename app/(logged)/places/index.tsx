import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { HRShadow } from '@/common/components/views/hr-shadow';
import { PlacesList } from '@/common/screens/places/list/places-list';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Place, WithId } from '@appjusto/types';
import { Stack, router } from 'expo-router';
import { View } from 'react-native';

export default function PlacesScreen() {
  // context
  const api = useContextApi();
  // tracking
  useTrackScreenView('Endereços');
  // handlers
  const selectPlaceHandler = (place: WithId<Place>) => {
    api
      .consumers()
      .updatePlace(place.id)
      .then(() => router.back());
  };
  const newAddressHandler = () => {
    router.replace('/(logged)/places/new');
  };
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
        <HRShadow />
        <View
          style={{ padding: paddings.lg, flexDirection: 'row', justifyContent: 'space-between' }}
        >
          <View style={{ flex: 1 }}>
            <DefaultButton title="Novo endereço" variant="outline" onPress={newAddressHandler} />
          </View>
        </View>
      </View>
    </View>
  );
}
