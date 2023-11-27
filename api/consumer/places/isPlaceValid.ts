import { Place } from '@appjusto/types';

export const isPlaceValid = (place: Partial<Place>) => {
  if (!place.location) return false;
  if (place.additionalInfo === undefined) return false;
  return true;
};
