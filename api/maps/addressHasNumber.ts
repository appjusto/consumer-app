import { Address } from '@appjusto/types';

export const addressHasNumber = (address: Address): boolean => {
  const entersNumber = /^.*[0-9]+.*$/;
  return entersNumber.test(address.main ?? '');
};
