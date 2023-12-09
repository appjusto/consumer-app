import { DefaultText } from '@/common/components/texts/DefaultText';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {}

export const HomeHeader = ({ style, ...props }: Props) => {
  return (
    <View style={[{}, style]} {...props}>
      <DefaultText>Home!</DefaultText>
    </View>
  );
};
