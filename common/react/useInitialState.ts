import { useEffect, useState } from 'react';

export const useInitialState = <T>(value: T | undefined) => {
  // state
  const [state, setState] = useState<T | undefined>(value);
  // side effects
  useEffect(() => {
    if (state === undefined && value !== undefined) {
      setState(value);
    }
  }, [state, value]);
  // result
  return state;
};
