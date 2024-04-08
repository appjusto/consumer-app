import { UserProfile } from '@appjusto/types';
import * as cpfutils from '@fnando/cpf';
import { isPhoneValid } from '../validators/phone';

export const isProfileValid = (profile: Partial<UserProfile> | null | undefined) => {
  if (!profile) return false;
  if (
    !profile.name?.length ||
    !profile.surname?.length ||
    !cpfutils.isValid(profile.cpf ?? '') ||
    !isPhoneValid(profile.phone ?? '')
  ) {
    return false;
  }
  return true;
};
