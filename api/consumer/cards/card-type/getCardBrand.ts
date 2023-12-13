import { Card, IuguCard, VRCard } from '@appjusto/types';
import { SupportedCardType } from './types';

export const getCardBrand = (card: Card): SupportedCardType | null => {
  if (card.processor === 'iugu') {
    const iuguCard = card as IuguCard;
    return iuguCard.token?.data.brand?.toLowerCase() as SupportedCardType;
  }
  if (card.processor === 'vr') {
    const vrCard = card as VRCard;
    return vrCard.type as SupportedCardType;
  }
  return null;
};
