import { toNumber } from 'lodash';

export const safeNumber = (value?: string) => {
  try {
    const n = toNumber(value);
    if (!isNaN(n) && isFinite(n)) return n;
  } catch (e: unknown) {
    console.log(e);
  }
  return 0;
};
