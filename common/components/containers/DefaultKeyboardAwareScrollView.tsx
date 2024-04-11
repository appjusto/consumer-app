import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view';

export const DefaultKeyboardAwareScrollView = ({ ...props }: KeyboardAwareScrollViewProps) => {
  return (
    <KeyboardAwareScrollView
      // style={[{ ...screens.default }, style]}
      enableOnAndroid
      enableAutomaticScroll
      keyboardOpeningTime={0}
      keyboardShouldPersistTaps="handled"
      scrollIndicatorInsets={{ right: 1 }}
      {...props}
    />
  );
};
