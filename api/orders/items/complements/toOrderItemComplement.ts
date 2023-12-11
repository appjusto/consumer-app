import { Complement, ComplementGroup, OrderItemComplement, WithId } from '@appjusto/types';

export const toOrderItemComplement = (
  group: WithId<ComplementGroup>,
  complement: WithId<Complement>,
  quantity = 1
): OrderItemComplement => ({
  name: complement.name,
  complementId: complement.id,
  price: complement.price,
  externalId: complement.externalId ?? '',
  group: {
    id: group.id,
    name: group.name,
    externalId: group.externalId ?? '',
  },
  quantity,
});
