import { PublicCourier, WithId } from '@appjusto/types';
import React from 'react';
import { useContextApi } from '../../ApiContext';

export const useFetchCourier = (code?: string) => {
  // context
  const api = useContextApi();
  // state
  const [courier, setCourier] = React.useState<WithId<PublicCourier> | null>();
  // side effects
  React.useEffect(() => {
    if (code?.length !== 7) return;
    setCourier(undefined);
    api.couriers().fetchCourierByCode(code).then(setCourier);
  }, [api, code]);
  // result
  return courier;
};
