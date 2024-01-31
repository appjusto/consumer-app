import { useContextApi } from '@/api/ApiContext';
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

export const useUpdateOrderDestination = (orderId: string | undefined) => {
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  // params
  const params = useLocalSearchParams<Params>();
  const { main, secondary, location, googlePlaceId = '' } = params;
  // state
  const [description, setDescription] = useState(params.description);
  // side effects
  useEffect(() => {
    console.log('useUpdateOrderDestination', orderId, description, main, secondary, location);
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
