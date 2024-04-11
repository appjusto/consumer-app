import { useContextOrderOptions } from '@/api/orders/context/order-context';
import { DefaultInput } from '@/common/components/inputs/default/DefaultInput';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { Loading } from '@/common/components/views/Loading';
import { MessageBox } from '@/common/components/views/MessageBox';
import { FullDate, formatTimestamp } from '@/common/formatters/timestamp';
import Selfie from '@/common/screens/profile/images/selfie';
import borders from '@/common/styles/borders';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { ThumbsDown, ThumbsUp } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView, View, ViewProps } from 'react-native';

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
      {courier ? (
        <View
          style={{
            marginTop: paddings.lg,
            padding: paddings.lg,
            ...borders.default,
            borderColor: colors.neutral100,
          }}
        >
          <View
            style={{
              marginTop: paddings.lg,
              flexDirection: 'row',
              flex: 1,
            }}
          >
            <Selfie courierId={courier.id} size={50} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
                marginLeft: paddings.lg,
              }}
            >
              <View>
                <DefaultText size="xs" color="neutral800">
                  {courier.code}
                </DefaultText>
                <DefaultText size="md">{courier.name}</DefaultText>
              </View>
            </View>
          </View>
          <View
            style={{
              marginTop: paddings.lg,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <DefaultText size="xs">Nº de corridas</DefaultText>
              <DefaultText style={{ marginTop: paddings.xs }} size="md" color="black">
                {courier.statistics.deliveries}
              </DefaultText>
            </View>
            <View>
              <DefaultText size="xs">Avaliações</DefaultText>
              <View style={{ marginTop: paddings.xs, flexDirection: 'row', alignItems: 'center' }}>
                <ThumbsUp size={16} color={colors.primary500} />
                <DefaultText style={{ marginLeft: paddings.xs }} size="md" color="primary900">
                  {courier.statistics.positiveReviews}
                </DefaultText>
                <ThumbsDown
                  style={{ marginLeft: paddings.sm }}
                  size={16}
                  color={colors.neutral500}
                />
                <DefaultText style={{ marginLeft: paddings.xs }} size="md" color="neutral700">
                  {courier.statistics.negativeReviews}
                </DefaultText>
              </View>
            </View>
            {courier.createdAt ? (
              <View>
                <DefaultText size="xs">Membro desde</DefaultText>
                <DefaultText style={{ marginTop: paddings.xs }} size="md" color="black">
                  {formatTimestamp(courier.createdAt, FullDate)}
                </DefaultText>
              </View>
            ) : null}
          </View>
        </View>
      ) : null}
      {courier === null ? (
        <MessageBox style={{ marginTop: paddings.lg }} variant="warning">
          Entregador/a não encontrado/a. Verifque o código e tente novmente.
        </MessageBox>
      ) : null}
    </View>
  );
};
