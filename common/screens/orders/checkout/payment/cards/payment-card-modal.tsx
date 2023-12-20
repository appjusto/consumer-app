import { cardType } from '@/api/consumer/cards/card-type';
import { getCardLastDigits } from '@/api/consumer/cards/card-type/getCardLastDigits';
import { getCardType } from '@/api/consumer/cards/card-type/getCardType';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { LinkButton } from '@/common/components/buttons/link/LinkButton';
import { ModalHandle } from '@/common/components/modals/modal-handle';
import { DefaultText } from '@/common/components/texts/DefaultText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Card, WithId } from '@appjusto/types';
import { Pencil, Trash2 } from 'lucide-react-native';
import { Modal, ModalProps, Pressable, View } from 'react-native';

interface Props extends ModalProps {
  card: WithId<Card> | undefined;
  loading: boolean;
  onDismiss: () => void;
  onDelete: () => void;
  onView: () => void;
}
export const PaymentCardModal = ({
  card,
  loading,
  onDismiss,
  onDelete,
  onView,
  ...props
}: Props) => {
  if (!card) return null;
  // UI
  const type = getCardType(card);
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
                {`${cardType.getTypeInfo(type as string).niceType}  ••••  ${getCardLastDigits(
                  card
                )}`}
              </DefaultText>
              <View style={{ marginTop: paddings['2xl'], flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <DefaultButton
                    title="Excluir"
                    variant="outline"
                    leftView={
                      <Trash2 style={{ marginRight: paddings.sm }} size={20} color={colors.black} />
                    }
                    disabled={loading}
                    loading={loading}
                    onPress={onDelete}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: paddings.lg }}>
                  <DefaultButton
                    title="Editar"
                    variant="outline"
                    leftView={
                      <Pencil style={{ marginRight: paddings.sm }} size={20} color={colors.black} />
                    }
                    disabled={loading}
                    onPress={onView}
                  />
                </View>
              </View>
              <LinkButton
                style={{ marginVertical: paddings['2xl'] }}
                variant="destructive"
                disabled={loading}
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
