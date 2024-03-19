import { useContextApi } from '@/api/ApiContext';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultInput } from '@/common/components/inputs/default/DefaultInput';
import { ModalHandle } from '@/common/components/modals/modal-handle';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Order, WithId } from '@appjusto/types';
import { useState } from 'react';
import { Modal, ModalProps, Pressable, View } from 'react-native';

const DefaultFeedback = 'Você pode utilizar apenas um cupom por pedido.';

interface Props extends ModalProps {
  order: WithId<Order>;
  onCancel: () => void;
}

export const CouponModal = ({ order, visible, onCancel, ...props }: Props) => {
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  // state
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState(DefaultFeedback);
  const [loading, setLoading] = useState(false);
  // handlers
  const updateCupomHandler = () => {
    if (!order?.id) return;
    setCode(code.toUpperCase());
    setFeedback(DefaultFeedback);
    setLoading(true);
    api
      .orders()
      .updateCoupon(order.id, code)
      .then(() => {
        setLoading(false);
        showToast('Cupom aplicado com sucesso!', 'success');
        onCancel();
      })
      .catch((error: unknown) => {
        setLoading(false);
        console.log(JSON.stringify(error));
        const message =
          error instanceof Error ? error.message : 'Não foi possível adicionar o cupom.';
        setFeedback(message);
      });
  };
  // UI
  return (
    <Modal transparent animationType="slide" visible={visible} {...props}>
      <Pressable style={{ flex: 1 }} onPress={onCancel}>
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
                padding: paddings.lg,
                backgroundColor: colors.white,
              }}
            >
              <ModalHandle style={{ marginTop: paddings.xl }} />
              <DefaultText style={{ marginTop: paddings.xl, alignSelf: 'center' }} size="lg">
                Cupom ou código de indicação
              </DefaultText>
              <View style={{ marginVertical: paddings['2xl'] }}>
                <DefaultText style={{ marginTop: paddings.lg }} color="black">
                  Código do cupom
                </DefaultText>
                <DefaultInput
                  inputStyle={{ textAlignVertical: 'top' }}
                  placeholder="Digite o código do cupom"
                  value={code}
                  error={feedback !== DefaultFeedback}
                  onChangeText={(value) => {
                    setCode(value);
                    setFeedback(DefaultFeedback);
                  }}
                />
                <DefaultText
                  style={{ marginTop: paddings.xs }}
                  color={feedback !== DefaultFeedback ? 'error500' : 'neutral800'}
                >
                  {feedback}
                </DefaultText>
              </View>
              <DefaultButton
                style={{ marginVertical: paddings.lg }}
                title="Aplicar cupom"
                disabled={!code}
                loading={loading}
                onPress={updateCupomHandler}
              />
            </View>
          </View>
        )}
      </Pressable>
    </Modal>
  );
};
