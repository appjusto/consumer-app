import { useContextIsUserAnonymous, useContextProfile } from '@/common/auth/AuthContext';
import { Place, WithId } from '@appjusto/types';
import React from 'react';
import { useContextApi } from '../../ApiContext';

export const useObservePlaces = (limit = 0) => {
  // context
  const api = useContextApi();
  const isAnonymous = useContextIsUserAnonymous();
  const profile = useContextProfile();
  const profileLoaded = Boolean(profile);
  // state
  const [places, setPlaces] = React.useState<WithId<Place>[]>();
  // side effects
  React.useEffect(() => {
    if (isAnonymous === undefined) return;
    if (isAnonymous === true) setPlaces([]);
    if (!profileLoaded) return;
    return api.consumers().observePlaces(setPlaces, limit);
  }, [api, limit, isAnonymous, profileLoaded]);
  // result
  return places;
};
