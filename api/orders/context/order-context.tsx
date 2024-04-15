import { useObserveBusiness } from '@/api/business/useObserveBusiness';
import { Fare, Order, PublicBusiness, WithId } from '@appjusto/types';
import { useGlobalSearchParams, useSegments } from 'expo-router';
import React from 'react';
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
  businessQuote?: WithId<Order> | null;
  p2pQuote?: WithId<Order> | null;
  business?: WithId<PublicBusiness> | null;
  fares?: Fare[] | undefined;
  options?: OrderOptions;
  loading?: boolean;
}

export const OrderProvider = ({ children }: Props) => {
  // context
  const { paymentMethod } = useContextPayments();
  const segments = useSegments();
  const confirming = segments.findLast(() => true)?.startsWith('confirming');
  // params
  const params = useGlobalSearchParams<{ orderId: string }>();
  const orderId = params.orderId;
  // state
  // const [order, setOrder] = useState<WithId<Order> | null>();
  const orderWithId = useObserveOrder(orderId);
  const businessQuote = useObserveBusinessQuote();
  const businessId = orderWithId?.business?.id ?? businessQuote?.business?.id;
  const business = useObserveBusiness(businessId);
  const p2pQuote = useObservePackageQuote();
  const options = useOrderOptions();
  const faresEnabled =
    Boolean(orderId) &&
    orderWithId?.status === 'quote' &&
    Boolean(orderWithId?.timestamps?.quote) &&
    !confirming;
  const { fares, loading } = useOrderFares(
    orderWithId,
    paymentMethod,
    options.fleetsIds,
    options.findersFee,
    faresEnabled
  );
  // console.log('paymentMethod', paymentMethod);
  // console.log('order-context', order?.id, orderWithId?.id, businessQuote?.id, packageQuote?.id);
  // side effects
  // useEffect(() => {
  //   if (orderWithId) setOrder(orderWithId);
  //   else if (businessQuote) setOrder(businessQuote);
  //   else if (packageQuote) setOrder(packageQuote);
  //   else setOrder(null);
  // }, [order, businessQuote, orderWithId, packageQuote]);
  // logs
  // console.log('OrderProvider', pathname, params, useSegments());
  // result
  return (
    <OrderContext.Provider
      value={{
        order: orderWithId,
        businessQuote,
        p2pQuote,
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

export const useContextBusinessQuote = () => {
  const value = React.useContext(OrderContext);
  if (!value) throw new Error('Api fora de contexto.');
  return value.businessQuote;
};

export const useContextP2PQuote = () => {
  const value = React.useContext(OrderContext);
  if (!value) throw new Error('Api fora de contexto.');
  return value.p2pQuote;
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
