import { useContextApi } from '@/api/ApiContext';
import { PaymentsHandledByBusiness } from '@/api/orders/payment';
import { useContextPlatformFees } from '@/api/platform/context/platform-context';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { CircledView } from '@/common/components/containers/CircledView';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { formatCurrency } from '@/common/formatters/currency';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Fee, Order, WithId } from '@appjusto/types';
import { Pressable, View, ViewProps } from 'react-native';

const calculateValue = (value: number, { fixed, percent }: Fee) => {
  if (!value) return 0;
  return Math.floor((value + fixed) / (1 - percent / 100));
};

const getTipValues = (fee: Fee) => {
  return [0, 3, 5, 10, 20].map((value) => {
    const cents = calculateValue(value * 100, fee);
    return {
      id: `${value}`,
      title: `R$${value}`,
      data: cents,
    };
  });
};

interface Props extends ViewProps {
  order: WithId<Order>;
  tip: number;
  onChange: (value: number) => void;
}

export const TipControl = ({ order, tip, style, onChange, ...props }: Props) => {
  // context
  const fees = useContextPlatformFees()?.processing.iugu.credit_card ?? {
    fixed: 9,
    percent: 2.42,
  };
  const api = useContextApi();
  const showToast = useShowToast();
  // helpers
  const { paymentMethod, courier } = order;
  const alreadyTipped = Boolean(order.tip?.value);
  const data = getTipValues(fees);
  const selectedTip =
    data.find((item) => {
      if (!order.tip?.value) return item.data === tip;
      return order.tip.value === item.data || calculateValue(order.tip.value, fees) === item.data;
    }) ?? data[0];
  // handlers
  const tipHandler = () => {
    api
      .orders()
      .updateOrder(order.id, { tip: { value: tip } })
      .then(() => {
        showToast('Caixinha enviada!', 'success');
      });
  };
  // UI
  if (!courier?.id) return null;
  if (!paymentMethod) return null;
  if (PaymentsHandledByBusiness.includes(paymentMethod)) return null;
  if (paymentMethod === 'pix') return null;
  return (
    <View
      style={[
        {
          padding: paddings.lg,
          backgroundColor: colors.white,
          borderRadius: 8,
          borderColor: colors.neutral100,
          borderWidth: 1,
        },
        style,
      ]}
      {...props}
    >
      <DefaultText size="lg">Caixinha</DefaultText>
      <DefaultText style={{ marginVertical: paddings.lg }} size="sm" color="neutral800">
        Adicionamos as taxas do cartão para que a pessoa receba a caixinha cheia.
      </DefaultText>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {getTipValues(fees).map((item) => {
          const selected = selectedTip.id === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => {
                if (!alreadyTipped) onChange(item.data);
              }}
            >
              <CircledView
                style={{
                  backgroundColor: selected ? colors.primary100 : colors.neutral50,
                  borderColor: selected ? colors.primary100 : colors.neutral50,
                }}
                size={60}
              >
                <DefaultText color={selected ? 'primary500' : 'neutral700'} size="md">
                  {item.title}
                </DefaultText>
              </CircledView>
            </Pressable>
          );
        })}
      </View>
      <DefaultText style={{ marginTop: paddings.lg }} size="sm" color="neutral800" bold>
        {`Total com taxas: ${formatCurrency(tip)}`}
      </DefaultText>
      <DefaultButton
        style={{ marginTop: paddings.lg }}
        disabled={alreadyTipped || !selectedTip.data}
        title={!alreadyTipped ? `Mandar caixinha` : 'Caixinha enviada ❤️'}
        onPress={tipHandler}
      />
    </View>
  );
};
