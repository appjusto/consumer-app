import { router } from 'expo-router';
import { useEffect } from 'react';
import { useContextOrder } from '../context/order-context';
import { FromScreen, getOrderPath } from './getOrderPath';

export const useOrderRoute = (from: FromScreen, back = false) => {
  // context
  const order = useContextOrder();
  const orderId = order?.id;
  const status = order?.status;
  const type = order?.type;
  const paymentMethod = order?.paymentMethod;
  // side effects
  useEffect(() => {
    if (!status) return;
    if (!type) return;
    if (!orderId) return;
    if (!paymentMethod) return;
    const pathname = getOrderPath(status, type, paymentMethod, from);
    if (pathname) {
      router.replace({
        pathname,
        params: { orderId },
      });
    } else if (back) {
      router.back();
    }
  }, [orderId, status, type, paymentMethod, from, back]);
};
