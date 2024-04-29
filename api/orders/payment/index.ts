import { PayableWith } from '@appjusto/types';

export const PaymentsHandledByBusiness: PayableWith[] = [
  'cash',
  'business-credit-card',
  'business-debit-card',
];

export const PaymentsOnlyOnFoodOrders = PaymentsHandledByBusiness.concat([
  'vr-alimentação',
  'vr-refeição',
]);
