import { useCards } from '@/api/consumer/cards/useCards';
import { useContextPlatformParams } from '@/api/platform/context/platform-context';
import { useContextProfile } from '@/common/auth/AuthContext';
import { Card, PayableWith, PublicBusiness, VRCard, WithId } from '@appjusto/types';
import React, { useEffect, useState } from 'react';

const PaymentsContext = React.createContext<Value>({});

interface Props {
  children: React.ReactNode;
}

interface Value {
  acceptedByPlatform?: PayableWith[];
  acceptedOnOrder?: PayableWith[];
  acceptsCards?: boolean;
  acceptedCardsOnOrder?: WithId<Card>[];
  selectedCard?: WithId<Card>;
  defaultPaymentMethod?: PayableWith | null;
  defaultPaymentMethodId?: string | null;
  paymentMethod?: PayableWith | null;
  setPaymentMethod?: (value: PayableWith) => void;
  paymentMethodId?: string | null;
  setPaymentMethodId?: (value: string) => void;
  setBusiness?: (value: PublicBusiness | undefined | null) => void;
}

export const PaymentsProvider = ({ children }: Props) => {
  // context
  const platformParams = useContextPlatformParams();
  const profile = useContextProfile();
  const acceptedByPlatform = platformParams?.acceptedPaymentMethods;
  const defaultPaymentMethod = profile ? profile.defaultPaymentMethod ?? null : undefined;
  const defaultPaymentMethodId = profile?.defaultPaymentMethodId;
  // states
  const cards = useCards();
  const [business, setBusiness] = useState<PublicBusiness | null>();
  const [acceptedOnOrder, setAcceptedOnOrder] = useState<PayableWith[]>();
  const [acceptedCardsOnOrder, setAcceptedCardsOnOrder] = useState<WithId<Card>[]>();
  const [paymentMethod, setPaymentMethod] = useState<PayableWith | null>();
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>();
  const selectedCard =
    acceptedCardsOnOrder?.find((card) => card.id === paymentMethodId) ??
    acceptedCardsOnOrder?.find(() => true);
  // side effects
  // set default payment
  useEffect(() => {
    if (defaultPaymentMethod === undefined) return;
    if (paymentMethod === null) return;
    if (paymentMethod) return;
    setPaymentMethod(defaultPaymentMethod);
  }, [defaultPaymentMethod, paymentMethod]);
  // set default payment method id
  useEffect(() => {
    if (defaultPaymentMethodId === undefined) return;
    if (paymentMethodId === null) return;
    if (paymentMethodId) return;
    setPaymentMethodId(defaultPaymentMethodId);
  }, [defaultPaymentMethodId, paymentMethodId]);
  // select payments accepted on order according with current context
  useEffect(() => {
    if (profile?.tags?.includes('unsafe')) {
      setAcceptedOnOrder(['pix']);
      return;
    }
    if (!acceptedByPlatform) return;
    if (!business) {
      setAcceptedOnOrder(
        acceptedByPlatform.filter((value) => value !== 'vr-alimentação' && value !== 'vr-refeição')
      );
    } else {
      setAcceptedOnOrder(
        acceptedByPlatform.filter((value) => business?.acceptedPaymentMethods?.includes(value))
      );
    }
  }, [profile, acceptedByPlatform, business]);
  // set accepted cards on order according with current context
  useEffect(() => {
    if (!acceptedOnOrder) return;
    if (!cards) return;
    setAcceptedCardsOnOrder(
      cards.filter((card) => {
        if (card.processor === 'iugu' && acceptedOnOrder?.includes('credit_card')) return true;
        if (card.processor === 'vr') {
          const vrCard = card as WithId<VRCard>;
          return acceptedOnOrder?.includes(vrCard.type);
        }
        return false;
      })
    );
  }, [acceptedOnOrder, cards]);
  // logs
  // console.log('acceptedPaymentMethods', business?.acceptedPaymentMethods);
  // result
  const acceptsCards =
    acceptedOnOrder?.includes('credit_card') ||
    acceptedOnOrder?.includes('vr-alimentação') ||
    acceptedOnOrder?.includes('vr-refeição');
  return (
    <PaymentsContext.Provider
      value={{
        acceptedByPlatform,
        acceptedOnOrder,
        acceptsCards,
        acceptedCardsOnOrder,
        selectedCard,
        defaultPaymentMethod,
        defaultPaymentMethodId,
        paymentMethod,
        setPaymentMethod,
        paymentMethodId,
        setPaymentMethodId,
        setBusiness,
      }}
    >
      {children}
    </PaymentsContext.Provider>
  );
};

export const useContextPayments = () => {
  const value = React.useContext(PaymentsContext);
  if (!value) throw new Error('Api fora de contexto.');
  return value;
};
