import { Business, BusinessAlgolia, LatLng } from '@appjusto/types';
import { distanceBetweenLatLng } from '../../maps/distance/distanceBetweenLatLng';

export const inDeliveryRange = (business: Business | BusinessAlgolia, destination: LatLng) => {
  const { businessAddress, deliveryRange = 0 } = business;
  const origin = businessAddress?.latlng;
  if (!origin) return false;
  const distance = distanceBetweenLatLng(destination, origin);
  return deliveryRange > distance;
};
