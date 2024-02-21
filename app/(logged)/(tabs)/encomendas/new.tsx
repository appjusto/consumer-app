import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useFetchPlace } from '@/api/consumer/places/useFetchPlace';
import { useContextOrder } from '@/api/orders/context/order-context';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

type Key = 'origin' | 'destination';

export default function NewPackageOrderScreen() {
  // params
  const params = useLocalSearchParams<{
    key: Key;
    placeId: string;
  }>();
  console.log('NewPackageOrderScreen', params);
  // const { state, originId, destinationId } = params;
  // context
  const api = useContextApi();
  const quote = useContextOrder();
  // state
  const [originId, setOriginId] = useState<string>();
  const [destinationId, setDestinationId] = useState<string>();
  const origin = useFetchPlace(originId);
  const destination = useFetchPlace(destinationId);
  // tracking
  useTrackScreenView('Encomendas: novo');
  // side effects
  // select origin
  useEffect(() => {
    if (quote === null) {
      console.log('NAVIGATING');
      router.navigate({
        pathname: '/encomendas/places',
        params: {
          key: 'origin',
        },
      });
    }
  }, [quote]);
  // select destination
  useEffect(() => {
    if (params.key === 'origin') {
      console.log('###', params.key, params.placeId);
      setOriginId(params.placeId);
      router.navigate({
        pathname: '/encomendas/places',
        params: {
          key: 'destination',
        },
      });
    } else if (params.key === 'destination') {
      setDestinationId(params.placeId);
    }
  }, [params]);
  // create order
  useEffect(() => {
    if (quote) return;
    if (!origin) return;
    api
      .orders()
      .createP2POrder(origin)
      .catch((error) => {
        // TODO: toast
        console.error(error);
      });
  }, [api, quote, origin]);
  // add destination
  useEffect(() => {
    if (!quote) return;
    if (!destination) return;
    if (quote.destination) return;
    api
      .orders()
      .updateOrder(quote.id, { destination })
      .catch((error) => {
        // TODO: toast
        console.error(error);
      });
  }, [api, quote, destination]);
  // logs
  console.log('quote', quote?.id, quote);
  console.log('origin', origin);
  console.log('destination', destination);
  // UI
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Entrega' }} />
      <DefaultView style={{ padding: paddings.lg }}></DefaultView>
    </DefaultScrollView>
  );
}
