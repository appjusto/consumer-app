import { useContextOrder } from '@/api/orders/context/order-context';
import { PaymentsHandledByBusiness } from '@/api/orders/payment';
import { useContextPayments } from '@/api/orders/payment/context/payments-context';
import { useContextIsUserAnonymous } from '@/common/auth/AuthContext';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import paddings from '@/common/styles/paddings';
import { router } from 'expo-router';
import { View, ViewProps } from 'react-native';
import { PaymentCard } from './cards/payment-card';
import { OfflinePaymentMethod } from './order-payment-business';
import { OrderPaymentPix } from './order-payment-pix';

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
    paymentMethod,
    paymentMethodId,
    setPaymentMethod,
    setPaymentMethodId,
  } = useContextPayments();
  // handlers
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
