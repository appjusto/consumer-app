import { useEffect } from 'react';

export const useDebounce = <T>(
  value: T,
  callback: (value: T) => void,
  enabled = true,
  delay = 1000
) => {
  // side effects
  useEffect(() => {
    if (!enabled) return;
    let isMounted = true;
    const timeout = setTimeout(() => {
      if (isMounted) callback(value);
    }, delay);
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [enabled, value, delay, callback]);
};
