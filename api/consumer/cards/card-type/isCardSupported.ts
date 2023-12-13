import { SupportedCardType } from './types';

const SupportedTypes: SupportedCardType[] = [
  'mastercard',
  'visa',
  'elo',
  'diners-club',
  'vr-alimentação',
  'vr-refeição',
];

export const isCardSupported = (type: string) => SupportedTypes.includes(type as SupportedCardType);
