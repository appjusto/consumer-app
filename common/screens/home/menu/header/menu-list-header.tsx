import { View, ViewProps } from 'react-native';
import { MenuListBusinessHeader } from './menu-list-business-header';

interface Props extends ViewProps {
  businessId: string;
}

export const MenuListHeader = ({ businessId, style, ...props }: Props) => {
  return (
    <View style={[{}, style]} {...props}>
      <MenuListBusinessHeader businessId={businessId} />
    </View>
  );
};
