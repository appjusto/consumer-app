import { cardType } from '@/api/consumer/cards/card-type';
import { getCardHolderName } from '@/api/consumer/cards/card-type/getCardHolderName';
import { getCardLastDigits } from '@/api/consumer/cards/card-type/getCardLastDigits';
import { getCardType } from '@/api/consumer/cards/card-type/getCardType';
import { OnlyIconButton } from '@/common/components/buttons/icon/OnlyIconButton';
import { RadioCardButton } from '@/common/components/buttons/radio/radio-card-button';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { formatCurrency } from '@/common/formatters/currency';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Card, WithId } from '@appjusto/types';
import { MoreVertical } from 'lucide-react-native';
import { View, ViewProps } from 'react-native';
import { CardIcon } from '../icons/card-icon';

interface Props extends ViewProps {
  card: WithId<Card>;
  variant?: 'default' | 'ongoing';
  checked?: boolean;
  value?: number;
  onPress?: () => void;
  onSelectOptions?: () => void;
}

export const PaymentCard = ({
  card,
  variant,
  checked,
  value,
  style,
  onPress,
  onSelectOptions,
  ...props
}: Props) => {
  const type = getCardType(card);
  if (!type) return null;
  const niceType = cardType.getTypeInfo(type as string)?.niceType ?? 'Crédito';
  const holderName = getCardHolderName(card);
  const lastDigits = getCardLastDigits(card);
  // UI
  return (
    <View style={[{}, style]} {...props}>
      <RadioCardButton
        style={variant === 'ongoing' ? { padding: 0, borderWidth: 0 } : undefined}
        checked={checked}
        onPress={onPress}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* logo */}
          <CardIcon type={type} />
          {/* details */}
          <View style={{ marginLeft: paddings.lg, maxWidth: '75%' }}>
            <DefaultText size="md" color="black">
              {card.processor === 'iugu' ? 'Crédito' : 'VR'}
            </DefaultText>
            <DefaultText
              style={{ marginTop: paddings.xs, flexWrap: 'wrap' }}
              size="md"
              color="neutral800"
            >
              {`${holderName} •••• ${lastDigits}`}
            </DefaultText>
          </View>
          <View style={{ flex: 1 }} />
          {onSelectOptions ? (
            <OnlyIconButton
              style={{ borderWidth: 0, backgroundColor: checked ? colors.primary100 : undefined }}
              icon={
                <MoreVertical size={20} color={checked ? colors.primary900 : colors.neutral900} />
              }
              onPress={onSelectOptions}
            />
          ) : null}
          {value ? (
            <DefaultText size="md" color="black">
              {formatCurrency(value)}
            </DefaultText>
          ) : null}
        </View>
      </RadioCardButton>
    </View>
  );
};
