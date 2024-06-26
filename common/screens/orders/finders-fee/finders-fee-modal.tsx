import { useContextOrderOptions } from '@/api/orders/context/order-context';
import { safeNumber } from '@/api/utils/numbers';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { PatternInput } from '@/common/components/inputs/pattern/PatternInput';
import { DefaultModal } from '@/common/components/modals/default-modal';
import { ModalHandle } from '@/common/components/modals/modal-handle';
import { DefaultText } from '@/common/components/texts/DefaultText';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Order, WithId } from '@appjusto/types';
import { useState } from 'react';
import { ModalProps, View } from 'react-native';

interface Props extends ModalProps {
  order: WithId<Order> | null | undefined;
  onDismiss: () => void;
}

export const FindersFeeModal = ({ order, onDismiss, ...props }: Props) => {
  // context
  const { findersFee, setFindersFee } = useContextOrderOptions() ?? {};
  const [fee, setFee] = useState(findersFee ?? '');
  // state
  const value = safeNumber(fee);
  // UI
  return (
    <DefaultModal onDismiss={onDismiss} {...props}>
      <View
        style={{
          padding: paddings.lg,
          backgroundColor: colors.white,
        }}
      >
        <ModalHandle style={{ marginTop: paddings.xl }} />
        <DefaultText style={{ marginTop: paddings.xl, alignSelf: 'center' }} size="lg">
          Comissão
        </DefaultText>
        <View style={{ marginVertical: paddings['2xl'] }}>
          <DefaultText style={{ marginTop: paddings.lg }} color="black">
            Sua comissão estará inclusa no valor do pedido
          </DefaultText>
          <PatternInput
            inputStyle={{ textAlignVertical: 'top' }}
            placeholder="Digite sua comissão"
            pattern="currency"
            value={fee}
            maxLength={8}
            onChangeText={setFee}
          />
        </View>
        <DefaultButton
          style={{ marginVertical: paddings.lg }}
          title="Confirmar"
          disabled={value <= 0}
          onPress={() => {
            if (setFindersFee) {
              setFindersFee(fee);
            }
            onDismiss();
          }}
        />
      </View>
    </DefaultModal>
  );
};
