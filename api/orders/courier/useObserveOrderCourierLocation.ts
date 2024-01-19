import { useContextApi } from '@/api/ApiContext';
import { LatLng } from '@appjusto/types';
import React from 'react';

export const useObserveOrderCourierLocation = (orderId?: string, courierId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [location, setLocation] = React.useState<LatLng | null>(null);
  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    if (!courierId) return;
    return api.orders().observeCourierLocation(orderId, courierId, setLocation);
  }, [api, orderId, courierId]);
  // result
  return location;
};
