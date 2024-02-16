import { useObservePlaces } from './useObservePlaces';

export const useObserveLastPlace = () => {
  // state
  const places = useObservePlaces(1);
  // result
  if (!places) return undefined;
  if (!places.length) return null;
  return places[0];
};
