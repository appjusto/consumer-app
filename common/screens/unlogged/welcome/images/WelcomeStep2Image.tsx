import { isLargeScreen } from '@/common/version/device';
import { Image, ImageProps } from 'expo-image';

interface Props extends ImageProps {}

const IMAGE = require('./step_02.png');
const SIZE = isLargeScreen() ? 360 : 260;

export const WelcomeStep2Image = ({ style, ...props }: Props) => {
  return <Image source={IMAGE} style={[{ width: SIZE, height: SIZE }, style]} />;
};
