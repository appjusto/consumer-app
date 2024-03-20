import { useContextApi } from '@/api/ApiContext';
import { useContextOrder, useContextOrderFares } from '@/api/orders/context/order-context';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { RadioCardButton } from '@/common/components/buttons/radio/radio-card-button';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { formatCurrency } from '@/common/formatters/currency';
import paddings from '@/common/styles/paddings';
import { Fare } from '@appjusto/types';
import crashlytics from '@react-native-firebase/crashlytics';
import { router } from 'expo-router';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {}

export const OrderFleetSelector = ({ style, ...props }: Props) => {
  // context
  const showToast = useShowToast();
  const api = useContextApi();
  const order = useContextOrder();
  // const options = useContextOrderOptions();
  const { fares } = useContextOrderFares();
  // side effects
  // if
  // useEffect(() => {
  //   if (!options) return;
  //   if (!options.fleetsIds) options.setFleetsIds([]);
  // }, [options]);
  // handlers
  const updateFare = (fare: Fare) => {
    if (!order) return;
    api
      .orders()
      .updateOrder(order.id, { fare })
      .catch((error) => {
        console.error(error);
        if (error instanceof Error) crashlytics().recordError(error);
        showToast('Não foi possível atualizar a forma de entrega. Tente novamente.', 'error');
      });
  };
  const selectFleet = () => {
    if (!order) return;
    router.navigate({
      pathname: '/(logged)/checkout/[orderId]/fleets/search',
      params: { orderId: order.id },
    });
  };
  // UI
  if (!order) return null;
  if (!fares) return null;
  return (
    <View style={[{}, style]} {...props}>
      <DefaultText style={{ marginTop: paddings.sm }} color="neutral700">
        Frotas são a forma que o appjusto desenvolveu para que os entregadores possam se organizar
        coletivamente e defiinir o valor e as condições do seu trabalho.
      </DefaultText>
      {fares.map((fare) => {
        if (!fare.fleet?.id) return null;
        const value = Math.max(0, (fare.courier?.value ?? 0) - (fare.courier?.discount ?? 0));
        return (
          <View key={fare.fleet?.id} style={{ flex: 1, marginTop: paddings.lg }}>
            <RadioCardButton
              onPress={() => updateFare(fare)}
              checked={fare.fleet?.id === order.fare?.fleet?.id}
            >
              <View
                style={{
                  flex: 1,
                  // borderWidth: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginRight: paddings.xl,
                }}
              >
                <View>
                  <DefaultText size="md" color="black">
                    {fare.fleet?.name}
                  </DefaultText>
                  <DefaultText style={{ marginTop: paddings.xs }}>
                    Ver detalhes da frota
                  </DefaultText>
                </View>
                <DefaultText size="md" color="black">
                  {formatCurrency(value)}
                </DefaultText>
              </View>
            </RadioCardButton>
          </View>
        );
      })}
      <DefaultButton
        style={{ marginTop: paddings.lg }}
        title="Escolher outra frota"
        variant="outline"
        onPress={selectFleet}
      />
    </View>
  );
};
