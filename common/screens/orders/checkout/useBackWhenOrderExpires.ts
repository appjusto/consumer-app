import { useContextOrderQuote } from '@/api/orders/context/order-context';
import { isOrderEmpty } from '@/api/orders/total/isOrderEmpty';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

export const useBackWhenOrderExpires = (enabled = true) => {
  // context
  const quote = useContextOrderQuote();
  // state
  const [isEmpty, setIsEmpty] = useState(isOrderEmpty(quote));
  // side effects
  useEffect(() => {
    setIsEmpty(isOrderEmpty(quote));
  }, [quote]);
  // go back when order becomes empty
  useEffect(() => {
    if (!enabled) return;
    if (isEmpty) {
      console.log('order isEmpty; going back');
      router.back();
      // router.push('/(logged)/(tabs)/(home)/');
    }
  }, [enabled, isEmpty]);
};
