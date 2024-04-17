import { LedgerEntry } from '@appjusto/types';
import { totalEntriesValue } from './totalEntriesValue';

export const totalApproved = (entries: LedgerEntry[] = []) =>
  totalEntriesValue(entries.filter((entry) => entry.status === 'approved'));
