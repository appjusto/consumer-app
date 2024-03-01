import { useContextApi } from '@/api/ApiContext';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { Place, WithId } from '@appjusto/types';
import { useIsFocused } from '@react-navigation/native';
import { router, useGlobalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

type Params = {
  description?: string;
  main?: string;
  secondary?: string;
  googlePlaceId?: string;
  location?: string;
  orderId?: string;
  additionalInfo?: string;
  instructions?: string;
};

export const useCreatePlace = () => {
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  const focused = useIsFocused();
  // params
  const params = useGlobalSearchParams<Params>();
  // const params = useLocalSearchParams<Params>();
  // console.log('useCreatePlace', focused, params);
  const {
    main,
    secondary,
    description,
    location,
    googlePlaceId = '',
    additionalInfo = '',
    instructions = '',
  } = params;
  // state
  const [place, setPlace] = useState<WithId<Place>>();
  // side effects
  useEffect(() => {
    if (!description) return;
    if (!main) return;
    if (!secondary) return;
    if (!location) return;
    if (!focused) return;
    const latlng = location.split(',').map((v) => parseFloat(v));
    const destination: Partial<Place> = {
      address: { description, main, secondary, googlePlaceId },
      location: { latitude: latlng[0], longitude: latlng[1] },
      additionalInfo,
      instructions,
    };
    api
      .consumers()
      .createPlace(destination)
      .then((id) => ({ ...destination, id }) as WithId<Place>)
      .then(setPlace)
      .then(() => {
        router.setParams({
          main: '',
          secondary: '',
          description: '',
          location: '',
          googlePlaceId: '',
          additionalInfo: '',
          instructions: '',
        });
      })
      .catch((error) => {
        console.log(error);
        showToast('Não foi possível salvar seu endereço. Tente novamente.', 'error');
      });
  }, [
    api,
    showToast,
    description,
    googlePlaceId,
    location,
    main,
    secondary,
    additionalInfo,
    instructions,
    focused,
  ]);
  return { place, setPlace };
};
