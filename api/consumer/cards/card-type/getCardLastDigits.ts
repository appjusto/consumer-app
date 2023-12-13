import { Card } from '@appjusto/types';
import { getCardDisplayNumber } from './getCardDisplayNumber';

export const getCardLastDigits = (card: Card): string => {
  const displayNumber = getCardDisplayNumber(card);
  if (!displayNumber) return '';
  return displayNumber.split('-').findLast(() => true) as string;
};
