import { useContextOrderPayments } from '@/api/orders/context/order-context';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import paddings from '@/common/styles/paddings';
import { View, ViewProps } from 'react-native';
import { PaymentCard } from './cards/payment-card';
import { OrderPaymentPix } from './order-payment-pix';

interface Props extends ViewProps {
  onAddCard: () => void;
}

export const OrderPaymentMethod = ({ onAddCard, style, ...props }: Props) => {
  // context
  const {
    acceptedOnOrder,
    acceptsCards,
    acceptedCardsOnOrder = [],
    paymentMethod,
    paymentMethodId,
    setPaymentMethod,
    setPaymentMethodId,
  } = useContextOrderPayments();
  // state
  // UI
  console.log(acceptedOnOrder);
  const acceptsPix = acceptedOnOrder?.includes('pix');
  return (
    <View style={[{}, style]} {...props}>
      {acceptsPix ? (
        <OrderPaymentPix
          checked={paymentMethod === 'pix'}
          onPress={() => {
            setPaymentMethod!('pix');
          }}
        />
      ) : null}
      {acceptedCardsOnOrder.map((card) => {
        return (
          <PaymentCard
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
