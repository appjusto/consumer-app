import { useContextApi } from '@/api/ApiContext';
import { useObserveBusinessQuote } from '@/api/orders/useObserveBusinessQuote';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { Place, WithId } from '@appjusto/types';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

type Params = {
  description?: string;
  main?: string;
  secondary?: string;
  googlePlaceId?: string;
  location?: string;
  orderId?: string;
};

type State = 'set-origin' | 'set-destination' | 'confirm-addresses';

export const usePackagePlaces = () => {
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  const quote = useObserveBusinessQuote();
  const orderId = quote?.id;
  // params
  const params = useLocalSearchParams<Params>();
  const { main, secondary, location, googlePlaceId = '' } = params;
  // state
  const [description, setDescription] = useState(params.description);
  // side effects
  useEffect(() => {
    console.log('usePackagePlaces', orderId, description, main, secondary, location);
    if (!orderId) return;
    if (!description) return;
    if (!main) return;
    if (!secondary) return;
    if (!location) return;
    setDescription('');
    const latlng = location.split(',').map((v) => parseFloat(v));
    const destination: Partial<Place> = {
      address: { description, main, secondary, googlePlaceId },
      location: { latitude: latlng[0], longitude: latlng[1] },
    };
    api
      .consumers()
      .createPlace(destination)
      .then((id) => ({ ...destination, id }) as WithId<Place>)
      .then((place) => api.orders().updateOrder(orderId, { destination: place }))
      .catch((error) => {
        console.log(error);
        showToast('Não foi possível salvar seu endereço. Tente novamente.', 'error');
      });
  }, [api, showToast, description, googlePlaceId, location, main, orderId, secondary]);
};
