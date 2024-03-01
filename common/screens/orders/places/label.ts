import { PlaceKey } from './types';

export const getPlaceTitle = (key: PlaceKey) => {
  if (key === 'origin') return 'Coleta';
  if (key === 'destination') return 'Entrega';
  return '';
};
