import { Modal, ModalProps, Pressable } from 'react-native';
import { DefaultKeyboardAwareScrollView } from '../containers/DefaultKeyboardAwareScrollView';

interface Props extends ModalProps {
  onDismiss: () => void;
}

export const DefaultModal = ({ onDismiss, children, ...props }: Props) => {
  return (
    <Modal transparent animationType="slide" {...props}>
      <DefaultKeyboardAwareScrollView
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.60)' }}
        contentContainerStyle={{ flex: 1 }}
      >
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0)' }} onPress={onDismiss} />
        {children}
      </DefaultKeyboardAwareScrollView>
    </Modal>
  );
};
