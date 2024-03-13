import { useContextApi } from '@/api/ApiContext';
import { useContextOrder } from '@/api/orders/context/order-context';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { useEffect } from 'react';
import { useCreatePlace } from './useCreatePlace';

export const useUpdateOrderDestination = () => {
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  const orderId = useContextOrder()?.id;
  // state
  const { place, setPlace } = useCreatePlace();
  // side effects
  // update order destination
  useEffect(() => {
    // console.log('useEffect', orderId, place);
    if (!orderId) return;
    if (!place) return;
    api
      .orders()
      .updateOrder(orderId, { destination: place })
      .then(() => {
        setPlace(undefined);
      })
      .catch((error) => {
        console.log(error);
        showToast('Não foi possível salvar seu endereço. Tente novamente.', 'error');
      });
  }, [api, showToast, place, orderId, setPlace]);
};
