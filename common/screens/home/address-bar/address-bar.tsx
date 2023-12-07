import { useContextCurrentPlace } from '@/api/preferences/context/PreferencesContext';
import { DefaultText } from '@/common/components/texts/DefaultText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { ChevronDown } from 'lucide-react-native';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {}

export const AdreessBar = ({ style, ...props }: Props) => {
  // context
  const currentPlace = useContextCurrentPlace();
  // UI
  return (
    <View
      style={[
        {
          padding: paddings.lg,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.neutral50,
        },
        style,
      ]}
      {...props}
    >
      <DefaultText style={{ textAlign: 'center' }} color="black">
        {currentPlace?.address?.main ?? ''}
      </DefaultText>
      <ChevronDown style={{ marginLeft: paddings.sm }} color={colors.black} size={16} />
    </View>
  );
};
