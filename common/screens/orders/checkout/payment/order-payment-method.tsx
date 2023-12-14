import { useContextOrderPayments } from '@/api/orders/context/order-context';
import { View, ViewProps } from 'react-native';
import { OrderPaymentCard } from './order-payment-card';
import { OrderPaymentPix } from './order-payment-pix';

interface Props extends ViewProps {}

export const OrderPaymentMethod = ({ style, ...props }: Props) => {
  // context
  const {
    acceptedCardsOnOrder,
    acceptedOnOrder,
    paymentMethod,
    paymentMethodId,
    setPaymentMethod,
    setPaymentMethodId,
  } = useContextOrderPayments();
  // state
  // UI
  console.log(acceptedOnOrder);
  return (
    <View style={[{}, style]} {...props}>
      {acceptedOnOrder?.includes('pix') ? (
        <OrderPaymentPix
          checked={paymentMethod === 'pix'}
          onPress={() => {
            setPaymentMethod!('pix');
          }}
        />
      ) : null}
      {(acceptedCardsOnOrder ?? []).map((card) => {
        return (
          <OrderPaymentCard
            card={card}
            checked={paymentMethod === 'credit_card' && card.id === paymentMethodId}
            key={card.id}
            onPress={() => {
              setPaymentMethod!('credit_card');
              setPaymentMethodId!(card.id);
            }}
          />
        );
      })}
    </View>
  );
};
