import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder } from '@/api/orders/context/order-context';
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
  const quote = useContextOrder();
  const orderId = quote?.id;
  // state
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<WithId<Place>>();
  // tracking
  useTrackScreenView('Checkout: alterar destino', { orderId });
  // handlers
  const updateOrderHandler = () => {
    if (!selectedPlace) return;
    if (!orderId) return;
    setLoading(true);
    api
      .consumers()
      .updatePlace(selectedPlace)
      .then(() => api.orders().updateOrder(orderId, { destination: selectedPlace }))
      .then(() => {
        setLoading(false);
        router.back();
      })
      .catch(() => {
        setLoading(false);
        // TODO: show toast
      });
  };
  const newPlaceHandler = () =>
    router.replace({
      pathname: `/checkout/${orderId}/places/new`,
    });
  // logs
  // console.log('checkout/[orderId]/places', orderId);
  // UI
  if (!orderId) return null;
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
            <DefaultButton title="Novo endereço" variant="outline" onPress={newPlaceHandler} />
          </View>
          <View style={{ flex: 1, marginLeft: paddings.lg }}>
            <DefaultButton
              title="Salvar"
              onPress={updateOrderHandler}
              disabled={!selectedPlace || selectedPlace?.id === quote?.destination?.id || loading}
              loading={loading}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
