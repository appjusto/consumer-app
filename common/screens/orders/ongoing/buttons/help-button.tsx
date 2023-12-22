import { DefaultText } from '@/common/components/texts/DefaultText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { HelpCircle } from 'lucide-react-native';
import { Pressable, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  onPress: () => void;
}

export const HelpButton = ({ style, onPress, ...props }: Props) => {
  return (
    <View
      style={[
        { paddingHorizontal: paddings.lg, paddingVertical: paddings.md, borderWidth: 0 },
        style,
      ]}
      {...props}
    >
      <Pressable onPress={onPress}>
        {() => (
          <View style={{ flexDirection: 'row' }}>
            <HelpCircle color={colors.error500} size={16} />
            <DefaultText style={{ marginLeft: paddings.xs }} color="error900">
              Ajuda
            </DefaultText>
          </View>
        )}
      </Pressable>
    </View>
  );
};
