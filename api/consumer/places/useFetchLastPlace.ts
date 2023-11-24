import { useFetchPlaces } from './useFetchPlaces';

export const useFetchLastPlace = () => {
  // state
  const places = useFetchPlaces();
  // result
  if (!places) return undefined;
  if (!places.length) return null;
  return places[0];
};
