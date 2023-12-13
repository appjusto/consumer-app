import { VRPayableWith } from '@appjusto/types';
import { CreditCardTypeCardBrandId } from 'credit-card-type/dist/types';

export type SupportedCardType = CreditCardTypeCardBrandId | VRPayableWith;

export interface CreditCardInfo {
  number: string;
  cvv: string;
  month: string;
  year: string;
  name: string;
}
