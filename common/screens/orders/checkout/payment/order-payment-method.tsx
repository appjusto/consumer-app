import { useContextOrder } from '@/api/orders/context/order-context';
import { PaymentsHandledByBusiness } from '@/api/orders/payment';
import { useContextPayments } from '@/api/orders/payment/context/payments-context';
import { useContextIsUserAnonymous } from '@/common/auth/AuthContext';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import paddings from '@/common/styles/paddings';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Linking, View, ViewProps } from 'react-native';
import { PaymentCard } from './cards/payment-card';
import { OfflinePaymentMethod } from './order-payment-business';
import { OrderPaymentPix } from './order-payment-pix';
import { OrderPaymentTicket } from './order-payment-ticket';

interface Props extends ViewProps {
  onAddCard: () => void;
}

export const OrderPaymentMethod = ({ onAddCard, style, ...props }: Props) => {
  // context
  const quote = useContextOrder();
  const isAnonymous = useContextIsUserAnonymous();
  const orderId = quote?.id;
  const {
    acceptedOnOrder,
    acceptsCards,
    acceptedCardsOnOrder = [],
    ticketAuthUrl,
    ticketBalance,
    refreshTicketBalance,
    paymentMethod,
    paymentMethodId,
    setPaymentMethod,
    setPaymentMethodId,
  } = useContextPayments();
  // side effects
  useFocusEffect(
    useCallback(() => {
      console.log('useFocusEffect: OrderPaymentMethod');
      if (refreshTicketBalance) refreshTicketBalance();
    }, [refreshTicketBalance])
  );
  // handlers
  const ticketPaymentHandler = () => {
    if (!ticketBalance) return;
    if (!ticketAuthUrl) return;
    if (ticketBalance.account === null) {
      Linking.openURL(ticketAuthUrl).catch((error) => {
        if (error) console.error(error);
      });
    } else if (setPaymentMethod) {
      setPaymentMethod('ticket-refeição');
    }
  };
  const offlinePaymentHandler = () =>
    router.navigate({
      pathname: '/(logged)/checkout/[orderId]/offline-payment',
      params: { orderId },
    });
  // logs
  // console.log('acceptedOnOrder', acceptedOnOrder);
  // UI
  if (isAnonymous || !setPaymentMethod || !setPaymentMethodId) return null;
  const acceptsPix = acceptedOnOrder?.includes('pix');
  const acceptsOfflinePayment = PaymentsHandledByBusiness.some(
    (value) => acceptedOnOrder?.includes(value)
  );
  const ticketBalanceValue = ticketBalance?.balance;
  const acceptsTicket = acceptedOnOrder?.includes('ticket-refeição');
  const offlinePaymentSelected = PaymentsHandledByBusiness.some((value) => value === paymentMethod);
  return (
    <View style={[{}, style]} {...props}>
      {acceptsPix ? (
        <OrderPaymentPix
          style={{ marginTop: paddings.lg }}
          checked={paymentMethod === 'pix'}
          onPress={() => setPaymentMethod('pix')}
        />
      ) : null}
      {acceptsTicket ? (
        <OrderPaymentTicket
          style={{ marginTop: paddings.lg }}
          checked={paymentMethod === 'ticket-refeição'}
          balance={ticketBalanceValue}
          onPress={() => ticketPaymentHandler()}
        />
      ) : null}
      {acceptsOfflinePayment ? (
        <OfflinePaymentMethod
          style={{ marginTop: paddings.lg }}
          checked={offlinePaymentSelected}
          onPress={offlinePaymentHandler}
        />
      ) : null}
      {acceptedCardsOnOrder.map((card) => {
        return (
          <PaymentCard
            style={{ marginTop: paddings.lg }}
            card={card}
            checked={paymentMethod === 'credit_card' && card.id === paymentMethodId}
            key={card.id}
            onPress={() => {
              setPaymentMethod('credit_card');
              setPaymentMethodId(card.id);
            }}
          />
        );
      })}
      {acceptsCards ? (
        <DefaultButton
          style={{ marginTop: paddings.lg }}
          title="Adicionar cartão"
          variant="outline"
          onPress={onAddCard}
        />
      ) : null}
    </View>
  );
};
