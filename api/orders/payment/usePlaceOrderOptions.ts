import { Order, PlaceOrderPayloadPayment, VRPayableWith, WithId } from '@appjusto/types';
import { useEffect, useState } from 'react';
import { PlaceOrderOptions } from '../types';
import { useContextPayments } from './context/payments-context';
import { OrderOptions } from './useOrderOptions';

export const usePlaceOrderOptions = (
  quote: WithId<Order> | null | undefined,
  options: OrderOptions
) => {
  // context
  const { paymentMethod, selectedCard } = useContextPayments();
  // state
  const [payment, setPayment] = useState<PlaceOrderPayloadPayment>();
  const [placeOptions, setOptions] = useState<PlaceOrderOptions>();
  // side effects
  useEffect(() => {
    // if (!quote) return;
    if (!paymentMethod) return;
    if (paymentMethod === 'pix') {
      setPayment({
        payableWith: 'pix',
        useCredits: true,
      });
    } else if (selectedCard?.processor === 'iugu') {
      setPayment({
        payableWith: 'credit_card',
        useCredits: true,
        cardId: selectedCard.id,
      });
    } else if (selectedCard?.processor === 'vr') {
      setPayment({
        payableWith: selectedCard.type as VRPayableWith,
        useCredits: true,
        cardId: selectedCard.id,
      });
    }
  }, [paymentMethod, selectedCard]);
  useEffect(() => {
    if (!quote) return;
    if (!payment) return;
    setOptions({
      orderId: quote.id,
      payment,
      fleetId: quote.fare?.fleet?.id,
      courierCode: options.courierCode,
      additionalInfo: options.additionalInfo,
      invoiceWithCPF: options.invoiceWithCPF,
      wantToShareData: options.wantToShareData,
      // TODO:
      // coordinates: null
    });
  }, [quote, payment, options]);
  // result
  return placeOptions;
};
