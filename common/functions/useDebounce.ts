import { useEffect, useRef } from 'react';

export const useDebounce = <T>(
  value: T,
  callback: (value: T) => void,
  enabled = true,
  delay = 1000
) => {
  // refs
  const callbackRef = useRef(callback);
  // side effects
  useEffect(() => {
    if (!enabled) return;
    let isMounted = true;
    const timeout = setTimeout(() => {
      if (isMounted) callbackRef.current(value);
    }, delay);
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [enabled, value, delay, callback]);
};
