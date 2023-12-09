import { ComplementGroup, OrderItemComplement, WithId } from '@appjusto/types';
import { totalComplements } from './totalComplements';

export const hasSatisfiedGroup = (
  group: WithId<ComplementGroup>,
  complements: OrderItemComplement[]
) => {
  const total = totalComplements(group, complements);
  return total >= group.minimum && total <= group.maximum;
};
