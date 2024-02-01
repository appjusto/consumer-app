import { OrderProvider } from '@/api/orders/context/order-context';
import { useGlobalSearchParams } from 'expo-router';
import React from 'react';
import { BusinessProvider } from '../../business/context/business-context';

const BusinessOrderContext = React.createContext<Value>({});

interface Props {
  children: React.ReactNode;
}

interface Value {}

export const BusinessOrderProvider = ({ children }: Props) => {
  const { businessId } = useGlobalSearchParams<{ businessId: string }>();
  // result
  return (
    <BusinessOrderContext.Provider value={{}}>
      <BusinessProvider businessId={businessId}>
        <OrderProvider businessId={businessId}>{children}</OrderProvider>
      </BusinessProvider>
    </BusinessOrderContext.Provider>
  );
};
