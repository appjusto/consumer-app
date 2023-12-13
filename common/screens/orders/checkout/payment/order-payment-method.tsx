import { cardType } from '@/api/consumer/cards/card-type';
import { getCardLastDigits } from '@/api/consumer/cards/card-type/getCardLastDigits';
import { getCardType } from '@/api/consumer/cards/card-type/getCardType';
import { useContextOrderPayments } from '@/api/orders/context/order-context';
import { RadioCardButton } from '@/common/components/buttons/radio/RadioCardButton';
import { DefaultText } from '@/common/components/texts/DefaultText';
import paddings from '@/common/styles/paddings';
import { View, ViewProps } from 'react-native';
import { CardIcon } from './cards/card-icon';

interface Props extends ViewProps {}

export const OrderPaymentMethod = ({ style, ...props }: Props) => {
  // context
  const {
    acceptedCardsOnOrder,
    paymentMethod,
    paymentMethodId,
    setPaymentMethod,
    setPaymentMethodId,
  } = useContextOrderPayments();
  // state
  // UI
  return (
    <View style={[{}, style]} {...props}>
      {(acceptedCardsOnOrder ?? []).map((card) => {
        const type = getCardType(card);
        return (
          <View style={{ marginTop: paddings.lg }} key={card.id}>
            <RadioCardButton
              checked={paymentMethod === 'credit_card' && card.id === paymentMethodId}
              onPress={() => {
                setPaymentMethod!('credit_card');
                setPaymentMethodId!(card.id);
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* logo */}
                <View>
                  <CardIcon type={type} />
                </View>
                {/* details */}
                <View style={{ marginLeft: paddings.md, borderWidth: 0 }}>
                  <DefaultText size="md" color="black">
                    {card.processor === 'iugu' ? 'Crédito' : 'VR'}
                  </DefaultText>
                  <DefaultText style={{ marginTop: paddings.xs }} size="md" color="neutral800">
                    {`${cardType.getTypeInfo(type as string).niceType}  ••••  ${getCardLastDigits(
                      card
                    )}`}
                  </DefaultText>
                </View>
              </View>
            </RadioCardButton>
          </View>
        );
      })}
    </View>
  );
};
