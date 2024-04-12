import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { LinkButton } from '@/common/components/buttons/link/LinkButton';
import { ModalHandle } from '@/common/components/modals/modal-handle';
import { DefaultText } from '@/common/components/texts/DefaultText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Place } from '@appjusto/types';
import { Trash2 } from 'lucide-react-native';
import { Modal, ModalProps, Pressable, View } from 'react-native';

interface Props extends ModalProps {
  place: Place | undefined;
  onDismiss: () => void;
  onDelete: () => void;
  onEdit: () => void;
}
export const PlaceListItemModal = ({ place, onDismiss, onDelete, onEdit, ...props }: Props) => {
  if (!place) return null;
  // UI
  return (
    <Modal transparent animationType="slide" {...props}>
      <Pressable style={{ flex: 1 }} onPress={onDismiss}>
        {() => (
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
            }}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: paddings.lg,
                backgroundColor: colors.white,
              }}
            >
              <ModalHandle />
              <DefaultText style={{ marginTop: paddings['2xl'] }} size="md" color="black">
                {place.address.main}
              </DefaultText>
              <View style={{ marginTop: paddings['2xl'], flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <DefaultButton
                    title="Excluir"
                    variant="outline"
                    leftView={
                      <Trash2 style={{ marginRight: paddings.sm }} size={20} color={colors.black} />
                    }
                    onPress={onDelete}
                  />
                </View>
                {/* <View style={{ flex: 1, marginLeft: paddings.lg }}>
                  <DefaultButton
                    title="Editar"
                    variant="outline"
                    leftView={
                      <Pencil style={{ marginRight: paddings.sm }} size={20} color={colors.black} />
                    }
                    onPress={onEdit}
                  />
                </View> */}
              </View>
              <LinkButton
                style={{ marginVertical: paddings['2xl'] }}
                variant="destructive"
                onPress={onDismiss}
              >
                Cancelar
              </LinkButton>
            </View>
          </View>
        )}
      </Pressable>
    </Modal>
  );
};
