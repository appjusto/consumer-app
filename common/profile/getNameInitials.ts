import { UserProfile } from '@appjusto/types';

export const getNameInitials = (profile: UserProfile) => {
  let initials = '';
  if (profile.name) initials = profile.name[0].toUpperCase();
  if (profile.surname) initials += profile.surname[0].toUpperCase();
  return initials;
};
