import { PublicCourier, WithId } from '@appjusto/types';
import { useEffect, useState } from 'react';
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
}

export const useOrderOptions = (): OrderOptions => {
  // state
  const [courierCode, setCourierCode] = useState<string>();
  const [additionalInfo, setAdditionalInfo] = useState<string>();
  const [invoiceWithCPF, setInvoiceWithCPF] = useState(false);
  const [wantToShareData, setWantToShareData] = useState(false);
  const [fleetsIds, setFleetsIds] = useState<string[]>();
  const courier = useFetchCourier(courierCode);
  // select fleetsIds
  useEffect(() => {
    if (!courier) return;
    setFleetsIds(courier.fleetsIds);
  }, [courier]);
  // result
  return {
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
  };
};
