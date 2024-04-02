import { RoundedView } from '@/common/components/containers/RoundedView';
import { DefaultText } from '@/common/components/texts/DefaultText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Pressable, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  title: string;
  rightView?: React.ReactNode;
  toggled?: boolean;
  onPress: () => void;
}

export const RoundedToggleButton = ({
  title,
  rightView,
  toggled = false,
  style,
  onPress,
  ...props
}: Props) => {
  return (
    <View style={[{ alignItems: 'flex-start' }, style]} {...props}>
      <Pressable onPress={onPress}>
        <RoundedView
          style={{
            paddingHorizontal: paddings.lg,
            paddingVertical: paddings.md,
            backgroundColor: toggled ? colors.primary100 : colors.white,
            borderColor: toggled ? colors.primary100 : colors.neutral400,
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <DefaultText color={toggled ? 'primary900' : 'neutral900'}>{title}</DefaultText>
            {rightView}
          </View>
        </RoundedView>
      </Pressable>
    </View>
  );
};
