import { ComplementGroup, OrderItemComplement, WithId } from '@appjusto/types';
import { totalComplements } from './totalComplements';

export const hasSatisfiedGroup = (
  group: WithId<ComplementGroup>,
  complements: OrderItemComplement[]
) => {
  const total = totalComplements(group, complements);
  // console.log(group.name, group.minimum, group.maximum, total);
  return total >= group.minimum && total <= group.maximum;
};
