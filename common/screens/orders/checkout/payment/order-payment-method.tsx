import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {}

export const OrderPaymentMethod = ({ style, ...props }: Props) => {
  // UI
  return <View style={[{}, style]} {...props}></View>;
};
