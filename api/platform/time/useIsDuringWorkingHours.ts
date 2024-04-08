import { Dayjs } from '@appjusto/dates';
import { toNumber } from 'lodash';
import { useContextPlatformParams } from '../context/platform-context';
import { useServerTime } from './useServerTime';

export const useIsDuringWorkingHours = async () => {
  // context
  const params = useContextPlatformParams();
  const getServerTime = useServerTime();
  const now = toNumber(Dayjs(getServerTime()).format('Hmm'));
  // console.log('useIsDuringWorkingHours', now);
  if (!params) return false;
  if (
    now < toNumber(params.consumer.support.starts) ||
    now > toNumber(params.consumer.support.ends)
  ) {
    return false;
  }
  return true;
};
