import { useOrderPayments } from '@/api/orders/payment/useOrderPayments';
import { Card, Fare, Order, PayableWith, WithId } from '@appjusto/types';
import { pick } from 'lodash';
import React from 'react';
import { useOrderFares } from '../payment/useOrderFares';
import { useObserveOrderQuote } from '../useObserveOrderQuote';

const OrderContext = React.createContext<Value>({});

interface Props {
  businessId?: string;
  children: React.ReactNode;
}

interface Value {
  quote?: WithId<Order> | null;
  fares?: Fare[] | undefined;
  loading?: boolean;
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
}

export const OrderProvider = ({ businessId, children }: Props) => {
  // state
  const quote = useObserveOrderQuote(businessId);
  const {
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
  } = useOrderPayments();
  const { fares, loading } = useOrderFares(quote, defaultPaymentMethod);
  const selectedCard = acceptedCardsOnOrder?.find((card) => card.id === paymentMethodId);
  // result
  return (
    <OrderContext.Provider
      value={{
        quote,
        fares,
        loading,
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
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useContextOrderQuote = () => {
  const value = React.useContext(OrderContext);
  if (!value) throw new Error('Api fora de contexto.');
  return value.quote;
};

export const useContextOrderFares = () => {
  const value = React.useContext(OrderContext);
  if (!value) throw new Error('Api fora de contexto.');
  return { fares: value.fares, loading: value.loading };
};

export const useContextOrderPayments = () => {
  const value = React.useContext(OrderContext);
  if (!value) throw new Error('Api fora de contexto.');
  return pick(value, [
    'acceptedByPlatform',
    'acceptedOnOrder',
    'acceptsCards',
    'acceptedCardsOnOrder',
    'defaultPaymentMethod',
    'defaultPaymentMethodId',
    'paymentMethod',
    'setPaymentMethod',
    'paymentMethodId',
    'setPaymentMethodId',
    'selectedCard',
  ]);
};
