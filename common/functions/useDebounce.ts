import { useEffect, useRef } from 'react';

export const useDebounce = <T>(
  value: T,
  callback: (value: T) => void,
  enabled = true,
  delay = 500
) => {
  // refs
  const timeoutRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);
  // handlers
  const cancel = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };
  // side effects
  useEffect(() => {
    if (!enabled) return;
    let isMounted = true;
    cancel();
    const timeout = setTimeout(() => {
      if (isMounted) callbackRef.current(value);
    }, delay);
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [enabled, value, delay, callback]);
  // result
  return cancel;
};
