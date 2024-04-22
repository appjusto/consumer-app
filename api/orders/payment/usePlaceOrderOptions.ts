import { useContextCurrentLocation } from '@/api/preferences/context/PreferencesContext';
import { formatCurrency } from '@/common/formatters/currency';
import { PlaceOrderPayloadPayment, VRPayableWith } from '@appjusto/types';
import { toNumber } from 'lodash';
import { useEffect, useState } from 'react';
import { useContextOrder, useContextOrderOptions } from '../context/order-context';
import { PlaceOrderOptions } from '../types';
import { useContextPayments } from './context/payments-context';

export const usePlaceOrderOptions = () => {
  // context
  const location = useContextCurrentLocation();
  const quote = useContextOrder();
  const { paymentMethod, selectedCard } = useContextPayments();
  const options = useContextOrderOptions();
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
    if (!options) return;
    let additionalInfo = options.change
      ? `Troco para ${formatCurrency(toNumber(options.change))}. `
      : '';
    if (options.additionalInfo) additionalInfo += options.additionalInfo;
    setOptions({
      orderId: quote.id,
      payment,
      fleetId: quote.fare?.fleet?.id,
      courierId: options.courier?.id,
      additionalInfo,
      invoiceWithCPF: options.invoiceWithCPF,
      wantToShareData: options.wantToShareData,
      findersFee: options.findersFee,
      coordinates: location,
    });
  }, [quote, payment, options, location]);
  // result
  return placeOptions;
};
