import { RadioCardButton } from '@/common/components/buttons/radio/radio-card-button';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { formatCurrency } from '@/common/formatters/currency';
import paddings from '@/common/styles/paddings';
import { View, ViewProps } from 'react-native';

export interface PaymentMethodProps extends ViewProps {
  icon?: React.ReactNode;
  title?: string;
  checked?: boolean;
  variant?: 'default' | 'ongoing';
  value?: number;
  onPress?: () => void;
}

export const PaymentMethod = ({
  icon,
  title,
  checked,
  variant,
  value,
  style,
  onPress,
  children,
  ...props
}: PaymentMethodProps) => {
  // UI
  return (
    <View style={[{}, style]} {...props}>
      <RadioCardButton
        style={variant === 'ongoing' ? { padding: 0, borderWidth: 0 } : undefined}
        checked={checked}
        onPress={onPress}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {icon}
          {/* details */}
          <View style={{ marginLeft: paddings.md, borderWidth: 0 }}>
            <DefaultText size="md" color="black">
              {title}
            </DefaultText>
          </View>
          <View style={{ flex: 1 }} />
          {value ? (
            <DefaultText size="md" color="black">
              {formatCurrency(value)}
            </DefaultText>
          ) : null}
        </View>
        {checked ? children : null}
      </RadioCardButton>
    </View>
  );
};
