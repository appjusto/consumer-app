import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import typography from '@/common/styles/typography';
import { Pressable, StyleProp, TextStyle, View, ViewProps } from 'react-native';
import { DefaultText } from '../../texts/DefaultText';

type LinkButtonProps = ViewProps & {
  size?: 'small' | 'medium';
  disabled?: boolean;
  variant?: 'default' | 'ghost' | 'destructive';
  textStyle?: StyleProp<TextStyle>;
  leftView?: React.ReactNode;
  onPress: () => void;
};

export const LinkButton = ({
  size = 'small',
  disabled,
  variant = 'default',
  style,
  textStyle,
  leftView,
  children,
  ...props
}: LinkButtonProps) => {
  return (
    <View style={[style]}>
      <Pressable disabled={disabled} {...props}>
        {({ pressed }) => (
          <View
            style={[
              {
                flexDirection: 'row',
                padding: paddings.md,
              },
            ]}
          >
            {leftView}
            <DefaultText
              style={[
                size === 'small' ? { ...typography.sm } : { ...typography.md },
                {
                  color: pressed
                    ? colors.neutral900
                    : variant === 'destructive'
                    ? colors.error900
                    : colors.black,
                  textDecorationLine: variant === 'default' ? 'underline' : 'none',
                },
                textStyle,
              ]}
            >
              {children}
            </DefaultText>
          </View>
        )}
      </Pressable>
    </View>
  );
};
