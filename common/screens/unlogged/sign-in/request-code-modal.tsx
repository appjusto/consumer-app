import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultModal } from '@/common/components/modals/default-modal';
import { ModalHandle } from '@/common/components/modals/modal-handle';
import { DefaultText } from '@/common/components/texts/DefaultText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { ModalProps, Pressable, View } from 'react-native';

interface Props extends ModalProps {
  timer: number;
  onRequest: () => void;
  onDismiss: () => void;
}
export const RequestCodeModal = ({ timer, onRequest, onDismiss, ...props }: Props) => {
  // UI
  return (
    <DefaultModal onDismiss={onDismiss} {...props}>
      <Pressable style={{ flex: 1 }} onPress={onDismiss} />
      <View style={{ padding: paddings.lg, backgroundColor: colors.white }}>
        <ModalHandle />
        <DefaultText style={{ marginTop: paddings['2xl'] }} size="xl">
          Solicitar outro código
        </DefaultText>
        <DefaultText style={{ marginTop: paddings['2xl'] }} size="md">
          Se você estiver com dificuldades em receber o código, clique no botão abaixo para
          solicitá-lo novamente.
        </DefaultText>
        {timer > 0 ? (
          <DefaultText style={{ marginTop: paddings.lg }} size="md">
            {`Você poderá solicitar o código em ${timer} segundos...`}
          </DefaultText>
        ) : null}
        <DefaultButton
          style={{ marginTop: paddings['2xl'] }}
          title="Solicitar código de acesso"
          disabled={timer > 0}
          onPress={onRequest}
        />
        <DefaultButton
          style={{ marginTop: paddings.lg, marginBottom: paddings.xl }}
          title="Cancelar"
          variant="outline"
          onPress={onDismiss}
        />
      </View>
    </DefaultModal>
  );
};
