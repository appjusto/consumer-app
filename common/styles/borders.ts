import { StyleProp, ViewStyle } from 'react-native';
import colors from './colors';

const base: StyleProp<ViewStyle> = {
  borderWidth: 1,
  borderRadius: 8,
  borderColor: colors.neutral500,
};

export default {
  default: base,
  white: {
    ...base,
    borderColor: colors.white,
  },
  light: {
    ...base,
    borderColor: colors.neutral100,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 32,
    borderColor: colors.black,
  },
};
