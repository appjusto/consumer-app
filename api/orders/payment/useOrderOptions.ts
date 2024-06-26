import { PublicCourier, WithId } from '@appjusto/types';
import { useEffect, useMemo, useState } from 'react';
import { useFetchCourier } from '../courier/useFetchCourier';

export interface OrderOptions {
  courierCode?: string;
  setCourierCode: (value: string) => void;
  courier?: WithId<PublicCourier> | null;
  fleetsIds?: string[];
  setFleetsIds: (value: string[]) => void;
  additionalInfo?: string;
  setAdditionalInfo: (value: string) => void;
  invoiceWithCPF: boolean;
  setInvoiceWithCPF: (value: boolean) => void;
  wantToShareData: boolean;
  setWantToShareData: (value: boolean) => void;
  findersFee: string;
  setFindersFee: (value: string) => void;
  change?: string;
  setChange: (value: string) => void;
}

export const useOrderOptions = (): OrderOptions => {
  // state
  const [courierCode, setCourierCode] = useState<string>();
  const [additionalInfo, setAdditionalInfo] = useState<string>();
  const [invoiceWithCPF, setInvoiceWithCPF] = useState(false);
  const [wantToShareData, setWantToShareData] = useState(false);
  const [fleetsIds, setFleetsIds] = useState<string[]>();
  const [findersFee, setFindersFee] = useState('');
  const [change, setChange] = useState('');
  const courier = useFetchCourier(courierCode?.toUpperCase());
  const options = useMemo<OrderOptions>(
    () => ({
      courierCode,
      setCourierCode,
      courier,
      fleetsIds,
      setFleetsIds,
      additionalInfo,
      setAdditionalInfo,
      invoiceWithCPF,
      setInvoiceWithCPF,
      wantToShareData,
      setWantToShareData,
      findersFee,
      setFindersFee,
      change,
      setChange,
    }),
    [
      additionalInfo,
      courier,
      courierCode,
      fleetsIds,
      invoiceWithCPF,
      wantToShareData,
      findersFee,
      change,
    ]
  );
  // select fleetsIds
  useEffect(() => {
    if (!courier) return;
    setFleetsIds(courier.fleetsIds);
  }, [courier]);
  // result
  return options;
};
