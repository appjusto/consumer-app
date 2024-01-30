import { Place, WithId } from '@appjusto/types';
import React from 'react';
import { useContextApi } from '../../ApiContext';

export const useFetchPlace = (placeId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [place, setPlace] = React.useState<WithId<Place> | null>();
  // side effects
  React.useEffect(() => {
    if (!placeId) return;
    api.consumers().fetchPlace(placeId).then(setPlace);
  }, [api, placeId]);
  // result
  return place;
};
