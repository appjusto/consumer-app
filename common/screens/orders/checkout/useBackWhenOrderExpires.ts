import { useContextOrderQuote } from '@/api/orders/context/order-context';
import { router } from 'expo-router';
import { useEffect } from 'react';

export const useBackWhenOrderExpires = () => {
  // context
  const quote = useContextOrderQuote();
  // side effects
  // go back when order becomes empty
  useEffect(() => {
    if (quote === null) {
      console.log('quote === null; going back');
      router.push('/(logged)/(tabs)/(home)/');
    }
  }, [quote]);
};
