import { useObserveBusiness } from '@/api/business/useObserveBusiness';
import { Fare, Order, PublicBusiness, WithId } from '@appjusto/types';
import { useGlobalSearchParams, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useContextPayments } from '../payment/context/payments-context';
import { useOrderFares } from '../payment/useOrderFares';
import { OrderOptions, useOrderOptions } from '../payment/useOrderOptions';
import { usePlaceOrderOptions } from '../payment/usePlaceOrderOptions';
import { PlaceOrderOptions } from '../types';
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
  placeOptions?: PlaceOrderOptions;
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
  const business = useObserveBusiness(order?.business?.id);
  const orderWithId = useObserveOrder(orderId);
  const businessQuote = useObserveBusinessQuote(businessId, businessContext);
  const packageQuote = useObservePackageQuote(packageContext);
  const options = useOrderOptions();
  const placeOptions = usePlaceOrderOptions(order, options);
  const { fares, loading } = useOrderFares(order, paymentMethod, options.fleetsIds);
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
        options,
        placeOptions,
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

export const useContextPlaceOrderOptions = () => {
  const value = React.useContext(OrderContext);
  if (!value) throw new Error('Api fora de contexto.');
  return value.placeOptions;
};
