import { cardType } from '@/api/consumer/cards/card-type';
import { getCardLastDigits } from '@/api/consumer/cards/card-type/getCardLastDigits';
import { getCardType } from '@/api/consumer/cards/card-type/getCardType';
import { OnlyIconButton } from '@/common/components/buttons/icon/OnlyIconButton';
import { RadioCardButton } from '@/common/components/buttons/radio/radio-card-button';
import { DefaultText } from '@/common/components/texts/DefaultText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Card, WithId } from '@appjusto/types';
import { MoreVertical } from 'lucide-react-native';
import { View, ViewProps } from 'react-native';
import { CardIcon } from '../icons/card-icon';

interface Props extends ViewProps {
  card: WithId<Card>;
  checked?: boolean;
  onPress?: () => void;
  onSelectOptions?: () => void;
}

export const PaymentCard = ({
  card,
  checked,
  style,
  onPress,
  onSelectOptions,
  ...props
}: Props) => {
  const type = getCardType(card);
  // UI
  return (
    <View style={[{ marginTop: paddings.lg }, style]} {...props}>
      <RadioCardButton checked={checked} onPress={onPress}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* logo */}
          <CardIcon type={type} />
          {/* details */}
          <View style={{ marginLeft: paddings.lg, borderWidth: 0 }}>
            <DefaultText size="md" color="black">
              {card.processor === 'iugu' ? 'Crédito' : 'VR'}
            </DefaultText>
            <DefaultText style={{ marginTop: paddings.xs }} size="md" color="neutral800">
              {`${cardType.getTypeInfo(type as string).niceType}  ••••  ${getCardLastDigits(card)}`}
            </DefaultText>
          </View>
          <View style={{ flex: 1 }} />
          <OnlyIconButton
            style={{ borderWidth: 0, backgroundColor: checked ? colors.primary100 : undefined }}
            icon={
              <MoreVertical size={20} color={checked ? colors.primary900 : colors.neutral900} />
            }
            onPress={() => {
              if (onSelectOptions) onSelectOptions();
            }}
          />
        </View>
      </RadioCardButton>
    </View>
  );
};
