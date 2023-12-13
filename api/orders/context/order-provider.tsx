import { useOrderPayments } from '@/api/orders/payment/useOrderPayments';
import { useObserveOrderQuote } from '@/api/orders/useObserveOrderQuote';
import { Fare, Order, PayableWith, WithId } from '@appjusto/types';
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
  acceptedOnOrder?: PayableWith[];
  defaultPaymentMethod?: PayableWith | null;
  defaultPaymentMethodId?: string | null;
}

export const OrderProvider = ({ businessId, children }: Props) => {
  // state
  const quote = useObserveOrderQuote(businessId);
  const { acceptedOnOrder, defaultPaymentMethod, defaultPaymentMethodId } = useOrderPayments();
  const fares = useOrderFares(quote, defaultPaymentMethod);
  // result
  return (
    <OrderContext.Provider
      value={{
        quote,
        fares,
        acceptedOnOrder,
        defaultPaymentMethod,
        defaultPaymentMethodId,
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
  return pick(value, ['acceptedOnOrder', 'defaultPaymentMethod', 'defaultPaymentMethodId']);
};
