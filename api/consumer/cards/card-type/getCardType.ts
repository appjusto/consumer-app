import { Card, IuguCard, VRCard } from '@appjusto/types';
import { SupportedCardType } from './types';

export const getCardType = (card: Card): SupportedCardType | null => {
  if (card.processor === 'iugu') {
    const iuguCard = card as IuguCard;
    if (!iuguCard.token?.data?.brand) return null;
    const brand = iuguCard.token.data.brand.toLowerCase();
    if (brand === 'master') return 'mastercard';
    return brand as SupportedCardType;
  }
  if (card.processor === 'vr') {
    const vrCard = card as VRCard;
    return vrCard.type as SupportedCardType;
  }
  return null;
};
