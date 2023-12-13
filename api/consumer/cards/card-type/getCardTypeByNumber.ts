import { cardType } from '.';
import { isCardSupported } from './isCardSupported';
import { SupportedCardType } from './types';

export const getCardTypeByNumber = (number: string) => {
  const types = cardType(number);
  if (types.length < 1) return null;
  const [type] = types;
  if (isCardSupported(type.type)) return type.type as SupportedCardType;
  return null;
};
