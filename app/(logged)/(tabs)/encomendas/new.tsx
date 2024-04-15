import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useFetchPlace } from '@/api/consumer/places/useFetchPlace';
import { useContextP2PQuote } from '@/api/orders/context/order-context';
import { DefaultKeyboardAwareScrollView } from '@/common/components/containers/DefaultKeyboardAwareScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { MessageBox } from '@/common/components/views/MessageBox';
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
  const quote = useContextP2PQuote();
  const focused = useIsFocused();
  // state
  const [state, setState] = useState<State>(() => {
    if (!quote) return 'new';
    if (!quote.origin?.id) return 'waiting-origin';
    if (!quote.destination?.id) return 'waiting-destination';
    return 'done';
  });
  const [originId, setOriginId] = useState<string>();
  const [destinationId, setDestinationId] = useState<string>();
  const origin = useFetchPlace(originId);
  const destination = useFetchPlace(destinationId);
  const [originInstructions, setOriginInstructions] = useState<string>();
  const [destinationInstructions, setDestinationInstructions] = useState<string>();
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
      .createP2POrder({ origin })
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
    console.log('updating origin...');
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
    console.log('updating destination...');
    api
      .orders()
      .updateOrder(quote.id, { destination })
      .catch((error) => {
        // TODO: toast
        console.error(error);
      });
  }, [api, quote, destination, state]);
  // set initial instructions
  useEffect(() => {
    if (!quote) return;
    // console.log('instructions', quote.origin?.id, originId, origin);
    if (!originId) {
      if (quote.origin?.id) setOriginId(quote.origin.id);
    } else if (origin && originInstructions === undefined) {
      setOriginInstructions(quote.origin?.instructions ?? origin?.instructions ?? '');
    }
    if (!destinationId) {
      if (quote.destination?.id) setDestinationId(quote.destination.id);
    } else if (destination && destinationInstructions === undefined) {
      setDestinationInstructions(quote.destination?.instructions ?? destination.instructions ?? '');
    }
  }, [
    quote,
    originId,
    origin,
    originInstructions,
    destinationId,
    destination,
    destinationInstructions,
  ]);
  // handlers
  const editPlaceHandler = (key: PlaceKey | number) => {
    if (typeof key === 'string') {
      navigateToPlace(key);
    }
  };
  const checkoutHandler = async () => {
    if (!quote?.origin || !quote.destination) return;
    if (!origin) return;
    if (!destination) return;
    if (originInstructions !== origin?.instructions) {
      await api.consumers().updatePlace(origin.id, { instructions: originInstructions });
    }
    if (destinationInstructions !== destination?.instructions) {
      await api.consumers().updatePlace(destination.id, { instructions: destinationInstructions });
    }
    await api.orders().updateOrder(quote.id, {
      origin: { ...origin, instructions: originInstructions },
      destination: { ...destination, instructions: destinationInstructions },
    });
    router.navigate({
      pathname: '/(logged)/checkout/[orderId]/delivery',
      params: { orderId: quote.id },
    });
  };
  // logs
  console.log('quote', quote?.id);
  // console.log('quote', quote?.id);
  // console.log('key', params.key);
  // console.log('origin', originId, Boolean(origin));
  // console.log('destination', destinationId, Boolean(destination));
  // UI
  const missingInstructions = !originInstructions || !destinationInstructions;
  const disabled = !quote?.destination || missingInstructions;
  return (
    <DefaultKeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
      <Stack.Screen options={{ title: 'Entrega' }} />
      <DefaultView style={{ ...screens.default, padding: paddings.lg }}>
        <ReviewP2POrder
          quote={quote}
          originInstructions={originInstructions ?? ''}
          setOriginInstructions={setOriginInstructions}
          destinationInstructions={destinationInstructions ?? ''}
          setDestinationInstructions={setDestinationInstructions}
          onEditPlace={editPlaceHandler}
        />
        {quote?.destination && missingInstructions ? (
          <MessageBox style={{ marginVertical: paddings.lg }} variant="warning">
            Escreva as instruções para coleta e entrega da encomenda.
          </MessageBox>
        ) : null}
        <View style={{ flex: 1 }} />
        <CartButton order={quote} variant="none" disabled={disabled} onPress={checkoutHandler} />
      </DefaultView>
    </DefaultKeyboardAwareScrollView>
  );
}
