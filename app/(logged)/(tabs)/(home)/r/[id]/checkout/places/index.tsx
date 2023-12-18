import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrderQuote } from '@/api/orders/context/order-context';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { PlacesList } from '@/common/screens/places/list/places-list';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Place, WithId } from '@appjusto/types';
import { Stack, router } from 'expo-router';

export default function CheckoutChangeDestinationScreen() {
  // context
  const api = useContextApi();
  const quote = useContextOrderQuote();
  const orderId = quote?.id;
  // tracking
  useTrackScreenView('Checkout: alterar destino');
  // handlers
  const selectHandler = (place: WithId<Place>) => {
    if (!orderId) return;
    api
      .orders()
      .updateOrder(orderId, { destination: place })
      .then(() => {
        return api.consumers().updatePlace(place);
      })
      .then(() => {
        router.back();
      });
  };
  // UI
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Seus endereços' }} />
      <DefaultView style={{ padding: paddings.lg }}>
        <PlacesList onSelect={selectHandler} />
      </DefaultView>
    </DefaultScrollView>
  );
}
