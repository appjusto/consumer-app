import { LatLng } from '@appjusto/types';
import { useEffect, useState } from 'react';
import { distanceBetweenLatLng } from './distanceBetweenLatLng';

export const useDistance = (a?: LatLng | null, b?: LatLng | null) => {
  // site
  const [distance, setDistance] = useState<number>();
  // side effects
  useEffect(() => {
    if (!a || !b) return;
    setDistance(distanceBetweenLatLng(a, b));
  }, [a, b]);
  // result
  return distance;
};
