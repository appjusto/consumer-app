import colors, { ColorName } from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { View, ViewProps } from 'react-native';
import { DefaultText } from '../texts/DefaultText';

interface Props extends ViewProps {
  variant: 'primary' | 'info' | 'neutral';
}

export const SimpleBadge = ({ variant, style, ...props }: Props) => {
  const backgroundColor = (() => {
    if (variant === 'primary') return colors.primary100;
    if (variant === 'info') return colors.info100;
    return colors.neutral50;
  })();
  const textColor: ColorName = (() => {
    if (variant === 'primary') return 'primary900';
    if (variant === 'info') return 'info900';
    return 'neutral800';
  })();
  return (
    <View
      style={[
        {
          backgroundColor,
          paddingHorizontal: paddings.sm,
          paddingVertical: paddings.xs,
          borderRadius: 4,
        },
        style,
      ]}
      {...props}
    >
      <DefaultText {...props} color={textColor} />
    </View>
  );
};
