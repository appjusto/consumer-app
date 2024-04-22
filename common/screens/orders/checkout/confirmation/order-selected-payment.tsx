import { PaymentsHandledByBusiness } from '@/api/orders/payment';
import { Card, PayableWith, WithId } from '@appjusto/types';
import { ViewProps } from 'react-native';
import { PaymentCard } from '../payment/cards/payment-card';
import { OfflinePaymentMethod } from '../payment/order-payment-business';
import { OrderPaymentPix } from '../payment/order-payment-pix';

interface Props extends ViewProps {
  paymentMethod: PayableWith | null | undefined;
  card: WithId<Card> | null | undefined;
  variant?: 'default' | 'ongoing';
  value?: number;
}

export const OrderSelectedPayment = ({ paymentMethod, card, style, ...props }: Props) => {
  const offlinePaymentSelected = PaymentsHandledByBusiness.some((value) => value === paymentMethod);
  // UI
  if (paymentMethod === 'pix') {
    return <OrderPaymentPix style={style} {...props} />;
  } else if (offlinePaymentSelected) {
    return <OfflinePaymentMethod style={style} {...props} />;
  } else if (card) {
    return <PaymentCard style={style} card={card} {...props} />;
  }
  return null;
};
