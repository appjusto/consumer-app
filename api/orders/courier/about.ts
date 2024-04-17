import { FullDate, formatTimestamp } from '@/common/formatters/timestamp';
import { PublicCourier } from '@appjusto/types';

export const aboutCourier = (courier: PublicCourier) => {
  if (courier?.about) {
    return courier.about;
  }
  if (courier?.createdAt) {
    return `Na rede appjusto desde ${formatTimestamp(courier.createdAt, FullDate)}`;
  }
  return '';
};
