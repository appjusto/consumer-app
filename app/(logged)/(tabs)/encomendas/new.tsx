import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useFetchPlace } from '@/api/consumer/places/useFetchPlace';
import { useContextOrder } from '@/api/orders/context/order-context';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { useUniqState } from '@/common/react/useUniqState';
import { CartButton } from '@/common/screens/home/businesses/detail/footer/cart-button';
import { ReviewP2POrder } from '@/common/screens/orders/p2p/review-p2p-order';
import { getPlaceTitle } from '@/common/screens/orders/places/label';
import { PlaceKey } from '@/common/screens/orders/places/types';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { useIsFocused } from '@react-navigation/native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

type State = 'new' | 'waiting-origin' | 'creating' | 'waiting-destination' | 'done';

export default function NewPackageOrderScreen() {
  // params
  const params = useUniqState(
    useLocalSearchParams<{
      key: PlaceKey;
      placeId: string;
    }>()
  );
  // context
  const api = useContextApi();
  const quote = useContextOrder();
  const focused = useIsFocused();
  // state
  const [state, setState] = useState<State>(() => {
    if (!quote) return 'new';
    if (!quote.origin?.id) return 'waiting-origin';
    if (!quote.destination?.id) return 'waiting-destination';
    return 'done';
  });
  console.log('quote', quote?.id);
  const [originId, setOriginId] = useState<string>();
  const [destinationId, setDestinationId] = useState<string>();
  const origin = useFetchPlace(originId);
  const destination = useFetchPlace(destinationId);
  // tracking
  useTrackScreenView('Encomendas: novo');
  // helpers
  const navigateToPlace = (key: PlaceKey) => {
    router.navigate({
      pathname: '/encomendas/places',
      params: {
        key,
        title: `Endereço de ${getPlaceTitle(key).toLocaleLowerCase()}`,
      },
    });
  };
  // side effects
  // update places with params
  useEffect(() => {
    console.log('params change', params);
    const { key, placeId } = params;
    // if (!key) navigateToPlace('origin');
    // else if (!placeId) return;
    // if (!focused) return;
    if (!placeId) return;
    if (key === 'origin') {
      setOriginId(placeId);
      router.setParams({ key: '', placeId: '' });
    } else if (key === 'destination') {
      setDestinationId(placeId);
      router.setParams({ key: '', placeId: '' });
    }
  }, [params]);
  // react when state changes
  useEffect(() => {
    console.log('state', state);
    if (state === 'new') {
      navigateToPlace('origin');
    } else if (state === 'waiting-origin') {
      navigateToPlace('origin');
    } else if (state === 'waiting-destination') {
      navigateToPlace('destination');
    }
  }, [state]);
  // create order
  useEffect(() => {
    if (!focused) return;
    if (!origin) return;
    if (quote) return;
    if (state !== 'new') return;
    setState('creating');
    api
      .orders()
      .createP2POrder(origin)
      .catch((error) => {
        // TODO: toast
        console.error(error);
      });
  }, [api, state, quote, origin, focused]);
  // move state to created
  useEffect(() => {
    if (!focused) return;
    if (state !== 'creating') return;
    if (!quote) return;
    setState('waiting-destination');
  }, [focused, state, quote]);
  // update origin
  useEffect(() => {
    if (!origin) return;
    if (!quote) return;
    if (quote.type !== 'p2p') return;
    if (quote.origin?.id === origin.id) return;
    api
      .orders()
      .updateOrder(quote.id, { origin })
      .catch((error) => {
        // TODO: toast
        console.error(error);
      });
  }, [api, quote, origin]);
  // update destination
  useEffect(() => {
    if (!destination) return;
    if (!quote) return;
    if (quote?.destination?.id === destination.id) return;
    if (state === 'waiting-destination') setState('done');
    api
      .orders()
      .updateOrder(quote.id, { destination })
      .catch((error) => {
        // TODO: toast
        console.error(error);
      });
  }, [api, quote, destination, state]);
  // handlers
  const editPlaceHandler = (key: PlaceKey | number) => {
    if (typeof key === 'string') {
      navigateToPlace(key);
    }
  };
  const checkoutHandler = () => {
    if (!quote) return;
    router.navigate({
      pathname: '/(logged)/checkout/[orderId]/delivery',
      params: { orderId: quote.id },
    });
  };
  // logs
  // console.log('quote', quote?.id);
  // console.log('key', params.key);
  // console.log('origin', originId, Boolean(origin));
  // console.log('destination', destinationId, Boolean(destination));
  // UI
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <Stack.Screen options={{ title: 'Entrega' }} />
      <DefaultView style={{ flex: 1, padding: paddings.lg }}>
        <ReviewP2POrder quote={quote} onEditPlace={editPlaceHandler} />
        <View style={{ flex: 1 }} />
        <CartButton
          order={quote}
          variant="checkout"
          disabled={!quote?.destination}
          onPress={checkoutHandler}
        />
      </DefaultView>
    </DefaultScrollView>
  );
}
