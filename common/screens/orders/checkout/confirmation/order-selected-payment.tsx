import { useContextOrderPayments } from '@/api/orders/context/order-context';
import { ViewProps } from 'react-native';
import { PaymentCard } from '../payment/cards/payment-card';
import { OrderPaymentPix } from '../payment/order-payment-pix';

interface Props extends ViewProps {}

export const OrderSelectedPayment = ({ style, ...props }: Props) => {
  // context
  const { paymentMethod, selectedCard } = useContextOrderPayments();
  // UI
  if (paymentMethod === 'pix') return <OrderPaymentPix />;
  else if (selectedCard) return <PaymentCard card={selectedCard} />;
  return null;
};
