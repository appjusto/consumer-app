import { useContextApi } from '@/api/ApiContext';
import { Cuisine, WithId } from '@appjusto/types';
import React from 'react';

export const useCuisines = () => {
  // context
  const api = useContextApi();
  // state
  const [cuisines, setCuisines] = React.useState<WithId<Cuisine>[]>();
  // side effects
  React.useEffect(() => {
    api.platform().fetchCuisines().then(setCuisines);
  }, [api]);
  // result
  return cuisines;
};
