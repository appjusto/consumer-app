import { useOrderPayments } from '@/api/orders/payment/useOrderPayments';
import { useObserveOrderQuote } from '@/api/orders/useObserveOrderQuote';
import { Card, Fare, Order, PayableWith, WithId } from '@appjusto/types';
import { pick } from 'lodash';
import React from 'react';
import { useOrderFares } from '../payment/useOrderFares';

const OrderContext = React.createContext<Value>({});

interface Props {
  businessId?: string;
  children: React.ReactNode;
}

interface Value {
  quote?: WithId<Order> | null;
  fares?: Fare[] | undefined;
  acceptedByPlatform?: PayableWith[];
  acceptedOnOrder?: PayableWith[];
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
    acceptedCardsOnOrder,
    defaultPaymentMethod,
    defaultPaymentMethodId,
    paymentMethod,
    setPaymentMethod,
    paymentMethodId,
    setPaymentMethodId,
  } = useOrderPayments();
  const fares = useOrderFares(quote, defaultPaymentMethod);
  const selectedCard = acceptedCardsOnOrder?.find((card) => card.id === paymentMethodId);
  // result
  return (
    <OrderContext.Provider
      value={{
        quote,
        fares,
        acceptedByPlatform,
        acceptedCardsOnOrder,
        selectedCard,
        acceptedOnOrder,
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
  return value.fares;
};

export const useContextOrderPayments = () => {
  const value = React.useContext(OrderContext);
  if (!value) throw new Error('Api fora de contexto.');
  return pick(value, [
    'acceptedByPlatform',
    'acceptedOnOrder',
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
