import { useContextOrderPayments } from '@/api/orders/context/order-context';
import { ViewProps } from 'react-native';
import { OrderPaymentCard } from '../payment/order-payment-card';
import { OrderPaymentPix } from '../payment/order-payment-pix';

interface Props extends ViewProps {}

export const OrderSelectedPayment = ({ style, ...props }: Props) => {
  // context
  const { acceptedCardsOnOrder, paymentMethod, paymentMethodId } = useContextOrderPayments();
  const card = acceptedCardsOnOrder?.find((card) => card.id === paymentMethodId);
  // UI
  if (paymentMethod === 'pix') return <OrderPaymentPix />;
  else if (card) return <OrderPaymentCard card={card} />;
  return null;
};
