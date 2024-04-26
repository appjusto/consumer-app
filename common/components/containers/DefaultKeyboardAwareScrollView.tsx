import { Platform } from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view';
import { DefaultScrollView } from './DefaultScrollView';

export const DefaultKeyboardAwareScrollView = ({ ...props }: KeyboardAwareScrollViewProps) => {
  if (Platform.OS === 'ios') {
    return (
      <KeyboardAwareScrollView
        enableAutomaticScroll
        keyboardOpeningTime={0}
        keyboardShouldPersistTaps="always"
        scrollIndicatorInsets={{ right: 1 }}
        {...props}
      />
    );
  }
  return <DefaultScrollView {...props} />;
};
