import { Fare, Order, WithId } from '@appjusto/types';
import { useGlobalSearchParams, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
  // params
  const params = useGlobalSearchParams<{ orderId: string; businessId: string }>();
  const { orderId, businessId } = params;
  const pathname = usePathname();
  const businessContext = Boolean(businessId) && !orderId;
  const packageContext = pathname.startsWith('/encomendas');
  // context
  const { paymentMethod } = useContextPayments();
  // state
  const [order, setOrder] = useState<WithId<Order> | null>();
  const orderWithId = useObserveOrder(orderId);
  const businessQuote = useObserveBusinessQuote(businessId, businessContext);
  const packageQuote = useObservePackageQuote(packageContext);
  const { fares, loading } = useOrderFares(order, paymentMethod);
  // side effects
  useEffect(() => {
    if (orderId) setOrder(orderWithId);
    else if (businessId) setOrder(businessQuote);
    else if (packageContext) setOrder(packageQuote);
    else setOrder(null);
  }, [orderId, orderWithId, businessId, businessQuote, packageContext, packageQuote]);
  // logs
  // console.log('OrderProvider', pathname, params, useSegments());
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
