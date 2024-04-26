import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultText } from '@/common/components/texts/DefaultText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { ModalProps, View } from 'react-native';
import { DefaultModal } from './default-modal';

interface Props extends ModalProps {
  text: string;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}
export const ConfirmModal = ({
  text,
  confirmButtonLabel = 'Sim',
  cancelButtonLabel = 'Não',
  onConfirm,
  onCancel,
  ...props
}: Props) => {
  return (
    <DefaultModal onDismiss={onCancel} {...props}>
      <View style={{ padding: paddings.lg, backgroundColor: colors.white }}>
        <DefaultText style={{ marginVertical: paddings['2xl'], textAlign: 'center' }} size="lg">
          {text}
        </DefaultText>
        <DefaultButton variant="destructive" title={confirmButtonLabel} onPress={onConfirm} />
        <DefaultButton
          style={{ marginVertical: paddings.md }}
          variant="outline"
          title={cancelButtonLabel}
          onPress={onCancel}
        />
      </View>
    </DefaultModal>
  );
};
