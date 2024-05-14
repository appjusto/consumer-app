import { Modal, ModalProps, Pressable, View } from 'react-native';
import { DefaultKeyboardAwareScrollView } from '../containers/DefaultKeyboardAwareScrollView';

interface Props extends ModalProps {
  onDismiss: () => void;
}

export const DefaultModal = ({ onDismiss, children, ...props }: Props) => {
  return (
    <Modal transparent animationType="slide" {...props}>
      <DefaultKeyboardAwareScrollView
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.60)', flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
      >
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0)' }} onPress={onDismiss} />
        {children}
      </DefaultKeyboardAwareScrollView>
    </Modal>
  );
};
