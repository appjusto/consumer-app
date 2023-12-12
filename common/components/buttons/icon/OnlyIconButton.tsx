import borders from '@/common/styles/borders';
import colors from '@/common/styles/colors';
import { Pressable, StyleProp, View, ViewProps, ViewStyle } from 'react-native';

type OnlyIconProps = ViewProps & {
  icon: React.ReactNode;
  variant?: 'default' | 'circle';
  disabled?: boolean;
  disabledIcon?: React.ReactNode;
  disabledStyle?: StyleProp<ViewStyle>;
  size?: number;
  onPress: () => void;
};

export const OnlyIconButton = ({
  icon,
  onPress,
  variant = 'default',
  disabled,
  disabledIcon,
  disabledStyle,
  size,
  style,
  ...props
}: OnlyIconProps) => {
  const realSize = size ? size : variant === 'default' ? 32 : 44;
  return (
    <Pressable
      style={[
        {
          width: realSize,
          height: realSize,
          ...borders.default,
          borderColor: colors.neutral200,
          borderRadius: variant === 'circle' ? realSize / 2 : realSize / 6,
          backgroundColor: disabled ? colors.neutral100 : colors.white,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      {...props}
    >
      {({ pressed }) => <View style={{}}>{disabled && disabledIcon ? disabledIcon : icon}</View>}
    </Pressable>
  );
};
