import { PublicCourier, WithId } from '@appjusto/types';
import React from 'react';
import { useContextApi } from '../../ApiContext';

export const useFetchCourierById = (courierId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [courier, setCourier] = React.useState<WithId<PublicCourier> | null>();
  // side effects
  React.useEffect(() => {
    if (!courierId) return;
    setCourier(undefined);
    api.couriers().fetchCourierById(courierId).then(setCourier);
  }, [api, courierId]);
  // result
  return courier;
};
