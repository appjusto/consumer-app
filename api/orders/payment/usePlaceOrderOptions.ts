import { VRPayableWith } from '@appjusto/types';
import { useEffect, useState } from 'react';
import { useContextOrderPayments, useContextOrderQuote } from '../context/order-context';
import { PlaceOrderOptions } from '../types';

export const usePlaceOrderOptions = () => {
  // context
  const quote = useContextOrderQuote();
  const { paymentMethod, selectedCard } = useContextOrderPayments();
  // state
  const [options, setOptions] = useState<PlaceOrderOptions>();
  // side effects
  useEffect(() => {
    if (!quote) return;
    if (!paymentMethod) return;
    if (paymentMethod === 'pix') {
      setOptions({
        orderId: quote.id,
        payment: {
          payableWith: 'pix',
          useCredits: true,
        },
      });
    } else if (selectedCard?.processor === 'iugu') {
      setOptions({
        orderId: quote.id,
        payment: {
          payableWith: 'credit_card',
          useCredits: true,
          cardId: selectedCard.id,
        },
      });
    } else if (selectedCard?.processor === 'vr') {
      setOptions({
        orderId: quote.id,
        payment: {
          payableWith: selectedCard.type as VRPayableWith,
          useCredits: true,
          cardId: selectedCard.id,
        },
      });
    }
  }, [quote, paymentMethod, selectedCard]);
  // result
  return options;
};
