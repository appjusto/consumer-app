import { cardType } from '@/api/consumer/cards/card-type';
import { getCardLastDigits } from '@/api/consumer/cards/card-type/getCardLastDigits';
import { getCardType } from '@/api/consumer/cards/card-type/getCardType';
import { RadioCardButton } from '@/common/components/buttons/radio/RadioCardButton';
import { DefaultText } from '@/common/components/texts/DefaultText';
import paddings from '@/common/styles/paddings';
import { Card, WithId } from '@appjusto/types';
import { View, ViewProps } from 'react-native';
import { CardIcon } from './cards/card-icon';

interface Props extends ViewProps {
  card: WithId<Card>;
  checked?: boolean;
  onPress?: () => void;
}

export const OrderPaymentCard = ({ card, checked, style, onPress, ...props }: Props) => {
  const type = getCardType(card);
  // UI
  return (
    <View style={[{ marginTop: paddings.lg }, style]} {...props}>
      <RadioCardButton checked={checked} onPress={onPress}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* logo */}
          <CardIcon type={type} />
          {/* details */}
          <View style={{ marginLeft: paddings.md, borderWidth: 0 }}>
            <DefaultText size="md" color="black">
              {card.processor === 'iugu' ? 'Crédito' : 'VR'}
            </DefaultText>
            <DefaultText style={{ marginTop: paddings.xs }} size="md" color="neutral800">
              {`${cardType.getTypeInfo(type as string).niceType}  ••••  ${getCardLastDigits(card)}`}
            </DefaultText>
          </View>
        </View>
      </RadioCardButton>
    </View>
  );
};
