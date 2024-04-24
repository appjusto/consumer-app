import { useContextApi } from '@/api/ApiContext';
import { useFetchPlace } from '@/api/consumer/places/useFetchPlace';
import { useContextOrder } from '@/api/orders/context/order-context';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

export const useUpdateOrderDestination = () => {
  // params
  const params = useLocalSearchParams<{ placeId: string }>();
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  const orderId = useContextOrder()?.id;
  // state
  const place = useFetchPlace(params.placeId);
  // side effects
  // update order destination
  useEffect(() => {
    // console.log('useUpdateOrderDestination', orderId, place);
    if (!orderId) return;
    if (!place) return;
    router.setParams({ placeId: '' });
    api
      .orders()
      .updateOrder(orderId, { destination: place })
      .catch((error) => {
        console.log(error);
        showToast('Não foi possível salvar seu endereço. Tente novamente.', 'error');
      });
  }, [api, showToast, place, orderId]);
};
