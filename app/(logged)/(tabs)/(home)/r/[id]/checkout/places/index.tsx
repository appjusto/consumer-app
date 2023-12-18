import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrderQuote } from '@/api/orders/context/order-context';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { HRShadow } from '@/common/components/views/hr-shadow';
import { PlacesList } from '@/common/screens/places/list/places-list';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Place, WithId } from '@appjusto/types';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

export default function CheckoutChangeDestinationScreen() {
  // context
  const api = useContextApi();
  const quote = useContextOrderQuote();
  const orderId = quote?.id;
  // state
  const [selectedPlace, setSelectedPlace] = useState<WithId<Place>>();
  // tracking
  useTrackScreenView('Checkout: alterar destino');
  // handlers
  const updateOrderHandler = () => {
    if (!selectedPlace) return;
    if (!orderId) return;
    api
      .consumers()
      .updatePlace(selectedPlace)
      .then(() => {
        api.orders().updateOrder(orderId, { destination: selectedPlace });
      })
      .then(() => {
        router.back();
      });
  };
  // UI
  return (
    <View style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Seus endereços' }} />
      <DefaultScrollView>
        <DefaultView style={{ padding: paddings.lg }}>
          <PlacesList
            selectedId={selectedPlace?.id ?? quote?.destination?.id}
            onSelect={setSelectedPlace}
          />
        </DefaultView>
      </DefaultScrollView>
      <View>
        <HRShadow />
        <View
          style={{ padding: paddings.lg, flexDirection: 'row', justifyContent: 'space-between' }}
        >
          <View style={{ flex: 1 }}>
            <DefaultButton title="Novo endereço" variant="outline" onPress={() => null} />
          </View>
          <View style={{ flex: 1, marginLeft: paddings.lg }}>
            <DefaultButton title="Salvar" onPress={updateOrderHandler} disabled={!selectedPlace} />
          </View>
        </View>
      </View>
    </View>
  );
}
