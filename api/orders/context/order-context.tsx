import { Fare, Order, WithId } from '@appjusto/types';
import { useGlobalSearchParams } from 'expo-router';
import React from 'react';
import { useContextPayments } from '../payment/context/payments-context';
import { useOrderFares } from '../payment/useOrderFares';
import { useObserveBusinessQuote } from '../useObserveBusinessQuote';
import { useObserveOrder } from '../useObserveOrder';
import { useObservePackageQuote } from '../useObservePackageQuote';

const OrderContext = React.createContext<Value>({});

interface Props {
  children: React.ReactNode;
}

interface Value {
  order?: WithId<Order> | null;
  fares?: Fare[] | undefined;
  loading?: boolean;
}

export const OrderProvider = ({ children }: Props) => {
  const { orderId, businessId } = useGlobalSearchParams<{ orderId: string; businessId: string }>();
  // context
  const { paymentMethod } = useContextPayments();
  // state
  const orderWithId = useObserveOrder(orderId);
  const businessQuote = useObserveBusinessQuote(businessId, Boolean(businessId) && !orderId);
  const packageQuote = useObservePackageQuote(!orderId && !businessId);
  const order = orderWithId ?? businessQuote ?? packageQuote;
  const { fares, loading } = useOrderFares(order, paymentMethod);
  console.log('OrderProvider', orderId, orderWithId);
  // result
  return (
    <OrderContext.Provider
      value={{
        order,
        fares,
        loading,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useContextOrder = () => {
  const value = React.useContext(OrderContext);
  if (!value) throw new Error('Api fora de contexto.');
  return value.order;
};

export const useContextOrderFares = () => {
  const value = React.useContext(OrderContext);
  if (!value) throw new Error('Api fora de contexto.');
  return { fares: value.fares, loading: value.loading };
};
