import colors, { ColorName } from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Pressable, StyleProp, TextProps, View, ViewProps } from 'react-native';
import { DefaultText } from '../../texts/DefaultText';

export type RadioButtonProps = ViewProps & {
  title?: string;
  checked: boolean;
  variant?: 'circle' | 'square';
  color?: ColorName;
  disabled?: boolean;
  textStyle?: StyleProp<TextProps>;
  onPress?: () => void;
};

const size = 18;

export const RadioButton = ({
  title,
  checked,
  variant = 'circle',
  color = 'black',
  disabled,
  style,
  textStyle,
  onPress,
  ...props
}: RadioButtonProps) => {
  return (
    <View style={[style]}>
      <Pressable onPress={onPress} {...props}>
        {({ pressed }) => (
          <View
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
              },
              style,
            ]}
          >
            <View
              style={[
                {
                  width: size,
                  height: size,
                  padding: paddings.xs,
                  borderWidth: 2,
                  borderRadius: variant === 'circle' ? size / 2 : size / 6,
                  borderColor: colors[color],
                  backgroundColor: colors.white,
                  opacity: pressed ? 0.8 : 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                // style,
              ]}
            >
              {checked && (
                <View
                  style={{
                    backgroundColor: colors[color],
                    borderRadius: variant === 'circle' ? size / 2 : size / 6,
                    width: size * 0.5,
                    height: size * 0.5,
                  }}
                />
              )}
            </View>
            {title ? (
              <DefaultText size="xs" style={[{ marginLeft: paddings.sm }, textStyle]}>
                {title}
              </DefaultText>
            ) : null}
          </View>
        )}
      </Pressable>
    </View>
  );
};
