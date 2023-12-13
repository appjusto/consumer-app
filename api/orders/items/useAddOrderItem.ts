import {
  useContextBusinessProduct,
  useContextBusinessProductCategory,
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
import { useContextOrderQuote } from '../context/order-context';
import { hasSatisfiedAllGroups } from './complements/hasSatisfiedAllGroups';
import { toOrderItemComplement } from './complements/toOrderItemComplement';
import { totalComplements } from './complements/totalComplements';

export const useAddOrderItem = (productId: string, itemId?: string) => {
  // context
  const product = useContextBusinessProduct(productId);
  const category = useContextBusinessProductCategory(productId);
  const quote = useContextOrderQuote();
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
  const updateComplementQuantity = (
    group: WithId<ComplementGroup>,
    complement: WithId<Complement>,
    delta: number
  ) => {
    const index = complements.findIndex((c) => c.complementId === complement.id);
    // add
    if (index === -1) {
      if (delta > 0) {
        setComplements([...complements, toOrderItemComplement(group, complement, delta)]);
      }
    } else {
      const orderComplement = complements[index];
      const quantity = Math.min(Math.max(orderComplement.quantity + delta, 0), group.maximum);
      // remove
      if (quantity === 0)
        setComplements(complements.filter((c) => c.complementId !== complement.id));
      // update
      else {
        setComplements([
          ...complements.slice(0, index),
          { ...orderComplement, quantity },
          ...complements.slice(index + 1),
        ]);
      }
    }
  };
  const toggleComplement = (
    group: WithId<ComplementGroup>,
    complement: WithId<Complement>,
    added: boolean
  ) => {
    setComplements(
      complements
        .filter((c) => c.group.id !== group.id)
        .concat(added ? [toOrderItemComplement(group, complement)] : [])
    );
  };

  const getComplementQuantity = (complementId: string) =>
    complements.find((c) => c.complementId === complementId)?.quantity ?? 0;

  const getTotalComplements = (group: WithId<ComplementGroup>) =>
    totalComplements(group, complements);

  const canAddComplement = (group: WithId<ComplementGroup>) =>
    totalComplements(group, complements) < group.maximum;

  const getOrderItem = (): OrderItem | null => {
    if (!product) return null;
    return {
      id: itemId ?? nanoid(),
      product: {
        id: productId,
        name: product.name,
        price: product.price,
        categoryName: category?.name ?? '',
        externalId: product.externalId ?? '',
        imageUrl: product.imageUrls?.find(() => true) ?? null,
      },
      quantity,
      notes,
      complements,
    };
  };
  // result
  return {
    canAddItem,
    quantity,
    setQuantity,
    canAddComplement,
    updateComplementQuantity,
    toggleComplement,
    getComplementQuantity,
    getTotalComplements,
    getOrderItem,
  };
};
