import { ComplementGroup, OrderItemComplement, WithId } from '@appjusto/types';

export const totalComplements = (
  group: WithId<ComplementGroup>,
  complements: OrderItemComplement[]
) =>
  complements
    .filter((c) => c.group.id === group.id)
    .reduce((total, complement) => total + complement.quantity, 0);
