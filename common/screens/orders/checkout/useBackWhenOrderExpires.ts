import { useContextOrder } from '@/api/orders/context/order-context';
import { isOrderEmpty } from '@/api/orders/total/isOrderEmpty';
import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

export const useBackWhenOrderExpires = (enabled = true) => {
  // context
  const quote = useContextOrder();
  // state
  const [isEmpty, setIsEmpty] = useState(isOrderEmpty(quote));
  const focused = useIsFocused();
  // side effects
  useEffect(() => {
    setIsEmpty(isOrderEmpty(quote));
  }, [quote]);
  // go back when order becomes empty
  useEffect(() => {
    if (!enabled) return;
    if (!focused) return;
    if (isEmpty) {
      console.log('order isEmpty; going back');
      router.back();
      // router.push('/(logged)/(tabs)/(home)/');
    }
  }, [enabled, isEmpty, focused]);
};
