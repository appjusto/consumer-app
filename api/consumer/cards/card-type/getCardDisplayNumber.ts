import { Card, IuguCard, VRCard } from '@appjusto/types';

export const getCardDisplayNumber = (card: Card): string => {
  if (card.processor === 'iugu') {
    const iuguCard = card as IuguCard;
    return iuguCard.token?.data.display_number as string;
  }
  if (card.processor === 'vr') {
    const vrCard = card as VRCard;
    return vrCard.token.data.display_number;
  }
  return '';
};
