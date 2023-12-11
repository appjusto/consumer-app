import colors, { ColorName } from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { View, ViewProps } from 'react-native';
import { DefaultText } from '../../texts/DefaultText';
import { OnlyIconButton } from '../icon/OnlyIconButton';

interface Props extends ViewProps {
  quantity: number;
  minValue?: number;
  disabled?: boolean;
  size?: number;
  textColor?: ColorName;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const QuantityButton = ({
  quantity,
  minValue = 0,
  disabled = false,
  size,
  textColor = 'neutral800',
  style,
  onIncrement,
  onDecrement,
  ...props
}: Props) => {
  // UI
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]} {...props}>
      <OnlyIconButton
        size={size}
        icon={
          quantity > minValue + 1 ? <Minus color={colors.black} /> : <Trash2 color={colors.black} />
        }
        disabledIcon={<Minus color={colors.neutral700} />}
        disabled={quantity <= minValue}
        onPress={onDecrement}
      />
      <DefaultText
        style={{
          marginHorizontal: paddings.lg,
          textAlignVertical: 'center',
          borderWidth: 0,
        }}
        size="md"
        color={textColor}
      >
        {quantity}
      </DefaultText>
      <OnlyIconButton
        size={size}
        icon={<Plus color={colors.black} />}
        disabledIcon={<Plus color={colors.neutral700} />}
        disabled={disabled}
        onPress={onIncrement}
      />
    </View>
  );
};
