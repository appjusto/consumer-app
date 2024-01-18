import { Card, PayableWith, WithId } from '@appjusto/types';
import { ViewProps } from 'react-native';
import { PaymentCard } from '../payment/cards/payment-card';
import { OrderPaymentPix } from '../payment/order-payment-pix';

interface Props extends ViewProps {
  paymentMethod: PayableWith | null | undefined;
  card: WithId<Card> | null | undefined;
  variant?: 'default' | 'ongoing';
}

export const OrderSelectedPayment = ({ paymentMethod, card, variant, style, ...props }: Props) => {
  // UI
  if (paymentMethod === 'pix') {
    return <OrderPaymentPix style={style} variant={variant} {...props} />;
  } else if (card) {
    return <PaymentCard style={style} card={card} variant={variant} {...props} />;
  }
  return null;
};
