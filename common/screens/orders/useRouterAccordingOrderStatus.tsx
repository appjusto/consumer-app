import { isOrderOngoing } from '@/api/orders/status';
import { OrderStatus } from '@appjusto/types';
import { router } from 'expo-router';
import { useEffect } from 'react';

export const useRouterAccordingOrderStatus = (
  orderId?: string,
  status?: OrderStatus | null,
  ongoing = false
) => {
  console.log('useRouterAccordingOrderStatus', status);
  // side effects
  useEffect(() => {
    console.log(orderId, status, status ? isOrderOngoing(status) : '-');
    if (!orderId) return;
    if (!status) return;
    if (isOrderOngoing(status) && !ongoing) {
      router.replace({
        pathname: '/(logged)/(tabs)/(orders)/[id]/ongoing',
        params: { id: orderId },
      });
    } else if (status === 'delivered') {
      router.replace({
        pathname: '/(logged)/(tabs)/(orders)/[id]/delivered',
        params: { id: orderId },
      });
    } else if (status === 'canceled') {
      // TODO
    }
  }, [orderId, status, ongoing]);
};
