import { useContextApi } from '@/api/ApiContext';
import { Card, WithId } from '@appjusto/types';
import React, { useEffect } from 'react';

export const useCards = () => {
  // context
  const api = useContextApi();
  // state
  const [cards, setCards] = React.useState<WithId<Card>[]>();
  // side-effects
  useEffect(() => {
    return api.consumers().observeCards(setCards);
  }, [api]);
  // resylt
  return cards;
};
