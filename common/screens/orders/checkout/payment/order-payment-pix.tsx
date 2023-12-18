import { RadioCardButton } from '@/common/components/buttons/radio/radio-card-button';
import { DefaultText } from '@/common/components/texts/DefaultText';
import paddings from '@/common/styles/paddings';
import { View, ViewProps } from 'react-native';
import { IconPixLogo } from './pix-logo';

interface Props extends ViewProps {
  checked?: boolean;
  onPress?: () => void;
}

export const OrderPaymentPix = ({ checked, style, onPress, ...props }: Props) => {
  // UI
  return (
    <View style={[{ marginTop: paddings.lg }, style]} {...props}>
      <RadioCardButton checked={checked} onPress={onPress}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* logo */}
          <IconPixLogo />
          {/* details */}
          <View style={{ marginLeft: paddings.md, borderWidth: 0 }}>
            <DefaultText size="md" color="black">
              Pix
            </DefaultText>
          </View>
        </View>
      </RadioCardButton>
    </View>
  );
};
