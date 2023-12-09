import {
  useContextBusinessProduct,
  useContextBusinessProductCategory,
  useContextBusinessQuote,
} from '@/api/business/context/business-context';
import {
  Complement,
  ComplementGroup,
  OrderItem,
  OrderItemComplement,
  WithId,
} from '@appjusto/types';
import { nanoid } from 'nanoid/non-secure';
import { useEffect, useState } from 'react';
import { hasSatisfiedAllGroups } from './complements/hasSatisfiedAllGroups';
import { totalComplements } from './complements/totalComplements';

export const useAddOrderItem = (productId: string, itemId?: string) => {
  // context
  const product = useContextBusinessProduct(productId);
  const category = useContextBusinessProductCategory(productId);
  const quote = useContextBusinessQuote();
  // state
  const [quantity, setQuantity] = useState(1);
  const [complements, setComplements] = useState<OrderItemComplement[]>([]);
  const [notes, setNotes] = useState<string>('');
  const canAddItem = !!product && hasSatisfiedAllGroups(product, complements);
  // side effects
  // update state if editing item
  useEffect(() => {
    if (!itemId) return;
    if (!quote) return;
    if (!product) return;
    const item = quote.items?.find((i) => i.id === itemId);
    if (!item) return;
    setComplements(item.complements ?? []);
    setQuantity(item.quantity);
    setNotes(item.notes ?? '');
  }, [itemId, quote, product]);
  // result
  // complements
  const addComplement = (group: WithId<ComplementGroup>, complement: WithId<Complement>) => {
    setComplements([
      ...complements,
      {
        name: complement.name,
        complementId: complement.id,
        price: complement.price,
        externalId: complement.externalId ?? '',
        group: {
          id: group.id,
          name: group.name,
          externalId: group.externalId ?? '',
        },
        quantity: 1,
      },
    ]);
  };
  const removeComplement = (complementId: string) => {
    setComplements(complements.filter((c) => c.complementId !== complementId));
  };
  const updateComplementQuantity = (complementId: string, delta: number) => {
    const index = complements.findIndex((c) => c.complementId === complementId);
    const complement = complements[index];
    const quantity = complement.quantity + delta;
    if (quantity === 0) removeComplement(complementId);
    else {
      setComplements([
        ...complements.slice(0, index),
        { ...complement, quantity },
        ...complements.slice(index + 1),
      ]);
    }
  };
  const getComplementQuantity = (complementId: string) =>
    complements.find((c) => c.complementId === complementId)?.quantity ?? 0;

  const getTotalComplements = (group: WithId<ComplementGroup>) =>
    totalComplements(group, complements);

  const canAddComplement = (group: WithId<ComplementGroup>) =>
    totalComplements(group, complements) < group.maximum;

  const getOrderItem = (): OrderItem | null => {
    if (!product) return null;
    if (!canAddItem) return null;
    return {
      id: itemId ?? nanoid(),
      product: {
        id: productId,
        name: product.name,
        price: product.price,
        categoryName: category?.name ?? '',
        externalId: product.externalId ?? '',
      },
      quantity,
      notes,
      complements,
    };
  };
  // result
  return {
    canAddItem,
    canAddComplement,
    addComplement,
    removeComplement,
    updateComplementQuantity,
    getComplementQuantity,
    getTotalComplements,
    getOrderItem,
  };
};
