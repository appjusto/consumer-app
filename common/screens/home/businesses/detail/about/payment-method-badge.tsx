import { DefaultText } from '@/common/components/texts/DefaultText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  title: string;
}

export const PaymentMethodBadge = ({ title, style, children, ...props }: Props) => {
  return (
    <View style={[{ alignItems: 'flex-start' }, style]} {...props}>
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            padding: paddings.xs,
            backgroundColor: colors.neutral50,
            borderRadius: 8,
          },
        ]}
      >
        {children}
        <DefaultText style={{ marginLeft: paddings.xs }}>{title}</DefaultText>
      </View>
    </View>
  );
};
