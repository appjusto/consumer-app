import { LedgerEntryStatus } from '@appjusto/types';

export const getLedgerStatusAsText = (status: LedgerEntryStatus) => {
  if (status === 'pending') return 'Pendente';
  if (status === 'approved') return 'Aprovado';
  if (status === 'processing') return 'Em processamento';
  if (status === 'paid') return 'Pago';
  if (status === 'rejected') return 'Rejeitado';
  if (status === 'canceled') return 'Cancelado';
  return '';
};
