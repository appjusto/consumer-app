import { useContextOrderOptions } from '@/api/orders/context/order-context';
import { DefaultInput } from '@/common/components/inputs/default/DefaultInput';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { Loading } from '@/common/components/views/Loading';
import { MessageBox } from '@/common/components/views/MessageBox';
import paddings from '@/common/styles/paddings';
import { useEffect, useState } from 'react';
import { SafeAreaView, View, ViewProps } from 'react-native';
import { CourierCard } from './courier-card';

interface Props extends ViewProps {}

export const OrderCourierSelector = ({ style, ...props }: Props) => {
  // context
  const { courierCode, setCourierCode, courier } = useContextOrderOptions() ?? {};
  // state
  const [editable, setEditable] = useState(true);
  // side effects
  useEffect(() => {
    if (courierCode?.length !== 7) return;
    setEditable(false);
  }, [courierCode]);
  useEffect(() => {
    setEditable(true);
  }, [courier]);
  // UI
  return (
    <View style={[{}, style]} {...props}>
      <DefaultText style={{ marginTop: paddings.sm }} color="neutral700">
        Você também pode enviar uma corrida diretamente para um entregador ou entregadora.
      </DefaultText>
      <SafeAreaView>
        <DefaultText style={{ marginTop: paddings.lg }} color="black">
          Código do entregador
        </DefaultText>
        <DefaultInput
          placeholder="Ex: J79H3AA"
          value={courierCode}
          onChangeText={setCourierCode}
          maxLength={7}
          autoCapitalize="characters"
          editable={editable}
        />
      </SafeAreaView>
      {!editable ? <Loading color="black" /> : null}
      <CourierCard style={{ marginTop: paddings.lg }} courier={courier} />
      {courier === null ? (
        <MessageBox style={{ marginTop: paddings.lg }} variant="warning">
          Entregador/a não encontrado/a. Verifque o código e tente novmente.
        </MessageBox>
      ) : null}
    </View>
  );
};
