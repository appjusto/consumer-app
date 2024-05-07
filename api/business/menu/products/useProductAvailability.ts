import { useServerTime } from '@/api/platform/time/useServerTime';
import { Order, Product } from '@appjusto/types';
import { useEffect, useState } from 'react';
import { shouldBeOpened } from '../../range/getBusinessAvailability';
import { getProductAvailability } from './getProductAvailability';

export const useProductAvailability = (
  product: Product | undefined,
  order: Order | undefined | null
) => {
  // context
  const getServerTime = useServerTime();
  // state
  const scheduledTo = order?.scheduledTo?.toDate() ?? getServerTime();
  const [availabilityWarning, setAvailabilityWarning] = useState('');
  // side effects
  // console.log('useProductAvailability', scheduledTo);
  useEffect(() => {
    if (
      !scheduledTo ||
      !product?.availability ||
      shouldBeOpened(product.availability, scheduledTo)
    ) {
      setAvailabilityWarning('');
    } else {
      setAvailabilityWarning(
        'Produto disponível apenas ' + getProductAvailability(product.availability) + '.'
      );
    }
  }, [scheduledTo, product]);
  // result
  return availabilityWarning;
};
