import colors from '@/common/styles/colors';
import Constants from 'expo-constants';
import { StyleProp, ViewStyle } from 'react-native';

const base: StyleProp<ViewStyle> = {
  flex: 1,
  backgroundColor: colors.white,
};

const headless: StyleProp<ViewStyle> = {
  ...base,
  marginTop: Constants.statusBarHeight,
};

const centered: StyleProp<ViewStyle> = {
  ...base,
  justifyContent: 'center',
  alignItems: 'center',
};

export default {
  default: base,
  headless,
  centered,
};
