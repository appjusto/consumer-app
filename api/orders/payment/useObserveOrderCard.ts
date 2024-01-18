import { useContextApi } from '@/api/ApiContext';
import {
  Card,
  CreditCardOrderPayments,
  OrderPayments,
  VROrderPayments,
  WithId,
} from '@appjusto/types';
import { useEffect, useState } from 'react';

export const useObserveOrderCard = (orderId: string | undefined) => {
  // context
  const api = useContextApi();
  // app state
  const [payment, setPayment] = useState<OrderPayments>();
  const [cardId, setCardId] = useState<string>();
  const [card, setCard] = useState<WithId<Card> | null>();
  // side effects
  // observe order payment
  useEffect(() => {
    if (!orderId) return;
    return api.orders().observePayment(orderId, setPayment);
  }, [api, orderId]);
  useEffect(() => {
    if (!payment) return;
    if (payment?.paymentMethod === 'pix') {
      setCard(null);
    } else if (payment?.paymentMethod === 'credit_card') {
      setCardId((payment as CreditCardOrderPayments).cardId);
    } else if (
      payment?.paymentMethod === 'vr-alimentação' ||
      payment?.paymentMethod === 'vr-refeição'
    ) {
      setCardId((payment as VROrderPayments).cardId);
    }
  }, [payment]);
  useEffect(() => {
    if (!cardId) return;
    api
      .consumers()
      .fetchCard(cardId)
      .then(setCard)
      .catch(() => setCard(null));
  }, [api, cardId]);
  // result
  return card;
};
