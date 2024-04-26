import { Card, IuguCard, VRCard } from '@appjusto/types';

export const getCardHolderName = (card: Card): string => {
  if (card.processor === 'iugu') {
    const iuguCard = card as IuguCard;
    return iuguCard.token?.data?.holder_name as string;
  }
  if (card.processor === 'vr') {
    const vrCard = card as VRCard;
    return vrCard.token?.data?.holder_name as string;
  }
  return '';
};
