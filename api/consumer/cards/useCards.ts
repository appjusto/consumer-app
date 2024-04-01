import { useContextApi } from '@/api/ApiContext';
import { Card, WithId } from '@appjusto/types';
import React, { useEffect } from 'react';

export const useCards = () => {
  // context
  const api = useContextApi();
  const userId = api.auth().getUserId();
  // state
  const [cards, setCards] = React.useState<WithId<Card>[]>();
  // side-effects
  useEffect(() => {
    if (!userId) return;
    return api.consumers().observeCards(setCards);
  }, [api, userId]);
  // result
  return cards;
};
