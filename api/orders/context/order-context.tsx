import { useContextBusiness } from '@/api/business/context/business-context';
import { Fare, Order, PublicBusiness, WithId } from '@appjusto/types';
import { useGlobalSearchParams, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useContextPayments } from '../payment/context/payments-context';
import { useOrderFares } from '../payment/useOrderFares';
import { OrderOptions, useOrderOptions } from '../payment/useOrderOptions';
import { useObserveBusinessQuote } from '../useObserveBusinessQuote';
import { useObserveOrder } from '../useObserveOrder';
import { useObservePackageQuote } from '../useObservePackageQuote';

const OrderContext = React.createContext<Value>({});

interface Props {
  children: React.ReactNode;
}

interface Value {
  order?: WithId<Order> | null;
  business?: WithId<PublicBusiness> | null;
  fares?: Fare[] | undefined;
  options?: OrderOptions;
  loading?: boolean;
}

export const OrderProvider = ({ children }: Props) => {
  // context
  const business = useContextBusiness();
  const businessId = business?.id;
  const { paymentMethod } = useContextPayments();
  // params
  const params = useGlobalSearchParams<{ orderId: string }>();
  const pathname = usePathname();
  // state
  const [order, setOrder] = useState<WithId<Order> | null>();
  const orderWithId = useObserveOrder(params.orderId);
  const businessQuote = useObserveBusinessQuote(businessId);
  const packageQuote = useObservePackageQuote(pathname.startsWith('/encomendas'));
  const options = useOrderOptions();
  const { fares, loading } = useOrderFares(order, paymentMethod, options.fleetsIds);
  // console.log('order-context', order?.id, orderWithId?.id, businessQuote?.id, packageQuote?.id);
  // side effects
  useEffect(() => {
    if (orderWithId) setOrder(orderWithId);
    else if (businessQuote) setOrder(businessQuote);
    else if (packageQuote) setOrder(packageQuote);
    else setOrder(undefined);
  }, [order, businessQuote, orderWithId, packageQuote]);
  // logs
  // console.log('OrderProvider', pathname, params, useSegments());
  // result
  return (
    <OrderContext.Provider
      value={{
        order,
        fares,
        options,
        business,
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

export const useContextOrderBusiness = () => {
  const value = React.useContext(OrderContext);
  if (!value) throw new Error('Api fora de contexto.');
  if (value.order?.type === 'p2p') return null;
  return value.business;
};

export const useContextOrderFares = () => {
  const value = React.useContext(OrderContext);
  if (!value) throw new Error('Api fora de contexto.');
  return { fares: value.fares, loading: value.loading };
};

export const useContextOrderOptions = () => {
  const value = React.useContext(OrderContext);
  if (!value) throw new Error('Api fora de contexto.');
  return value.options;
};
