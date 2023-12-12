import { fromDate } from '@/api/firebase/timestamp';
import { Dayjs } from '@appjusto/dates';
import { Timestamp } from '@appjusto/types/external/firebase';

export const DateTime = 'DD/MM • HH:mm';
export const FullDate = 'DD/MM/YYYY';
export const Time = 'HH[h]mm';

export const formatTimestamp = (timestamp: Timestamp, pattern?: string) =>
  formatDate(timestamp.toDate(), pattern);

export const formatDate = (date: Date, pattern?: string) => Dayjs(date).format(pattern ?? DateTime);

export const timestampWithETA = (timestamp: Timestamp, minutes = 30) =>
  `${formatTimestamp(timestamp, Time)} - ${formatTimestamp(
    fromDate(Dayjs(timestamp.toDate()).add(minutes, 'minutes').toDate()),
    Time
  )}`;
