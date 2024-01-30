import { Address } from '@appjusto/types';

export const addressesEqual = (a: Address, b: Address) => {
  if (a.main !== b.main) return false;
  if (a.secondary !== b.secondary) return false;
  if (a.description !== b.description) return false;
  return true;
};
