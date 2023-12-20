import { useContextBusiness } from '@/api/business/context/business-context';
import { useCards } from '@/api/consumer/cards/useCards';
import { useContextPlatformParams } from '@/api/platform/context/platform-context';
import { useContextProfile } from '@/common/auth/AuthContext';
import { Card, PayableWith, VRCard, WithId } from '@appjusto/types';
import { useEffect, useState } from 'react';

export const useOrderPayments = () => {
  // context
  const platformParams = useContextPlatformParams();
  const profile = useContextProfile();
  const acceptedByPlatform = platformParams?.acceptedPaymentMethods;
  const defaultPaymentMethod = profile ? profile.defaultPaymentMethod ?? null : undefined;
  const defaultPaymentMethodId = profile?.defaultPaymentMethodId ?? null;
  const business = useContextBusiness();
  // state
  const cards = useCards();
  const [acceptedOnOrder, setAcceptedOnOrder] = useState<PayableWith[]>();
  const [acceptedCardsOnOrder, setAcceptedCardsOnOrder] = useState<WithId<Card>[]>();
  const [paymentMethod, setPaymentMethod] = useState<PayableWith | null>();
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>();
  // side effects
  useEffect(() => {
    if (defaultPaymentMethod === undefined) return;
    if (paymentMethod === null) return;
    if (paymentMethod) return;
    setPaymentMethod(defaultPaymentMethod);
  }, [defaultPaymentMethod, paymentMethod]);
  useEffect(() => {
    if (defaultPaymentMethodId === undefined) return;
    if (paymentMethodId === null) return;
    if (paymentMethodId) return;
    setPaymentMethodId(defaultPaymentMethodId);
  }, [defaultPaymentMethodId, paymentMethodId]);
  useEffect(() => {
    if (profile?.tags?.includes('unsafe')) {
      setAcceptedOnOrder(['pix']);
      return;
    }
    if (!acceptedByPlatform) return;
    if (business === undefined) return;
    if (business === null) {
      setAcceptedOnOrder(
        acceptedByPlatform.filter((value) => value !== 'vr-alimentação' && value !== 'vr-refeição')
      );
    } else {
      setAcceptedOnOrder(
        acceptedByPlatform.filter((value) => business.acceptedPaymentMethods?.includes(value))
      );
    }
  }, [profile, acceptedByPlatform, business]);
  useEffect(() => {
    if (!acceptedOnOrder) return;
    if (!cards) return;
    setAcceptedCardsOnOrder(
      cards.filter((card) => {
        if (card.processor === 'iugu' && acceptedOnOrder.includes('credit_card')) return true;
        if (card.processor === 'vr') {
          const vrCard = card as WithId<VRCard>;
          return acceptedOnOrder.includes(vrCard.type);
        }
        return false;
      })
    );
  }, [acceptedOnOrder, cards]);
  // result
  const acceptsCards =
    acceptedOnOrder?.includes('credit_card') ||
    acceptedOnOrder?.includes('vr-alimentação') ||
    acceptedOnOrder?.includes('vr-refeição');
  return {
    acceptedByPlatform,
    acceptedOnOrder,
    acceptsCards,
    acceptedCardsOnOrder,
    defaultPaymentMethod,
    defaultPaymentMethodId,
    paymentMethod,
    setPaymentMethod,
    paymentMethodId,
    setPaymentMethodId,
  };
};
