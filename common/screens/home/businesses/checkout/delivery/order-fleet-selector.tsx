import { useContextApi } from '@/api/ApiContext';
import { useContextOrderFares } from '@/api/orders/context/order-context';
import { RadioCardButton } from '@/common/components/buttons/radio/radio-card-button';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { Loading } from '@/common/components/views/Loading';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { formatCurrency } from '@/common/formatters/currency';
import paddings from '@/common/styles/paddings';
import { Fare, Order, WithId } from '@appjusto/types';
import crashlytics from '@react-native-firebase/crashlytics';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  order: WithId<Order>;
}

export const OrderFleetSelector = ({ order, style, ...props }: Props) => {
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  const fares = useContextOrderFares();
  // handlers
  const updateFare = (fare: Fare) => {
    api
      .orders()
      .updateOrder(order.id, { fare })
      .catch((error) => {
        console.error(error);
        if (error instanceof Error) crashlytics().recordError(error);
        showToast('Não foi possível atualizar a forma de entrega. Tente novamente.', 'error');
      });
  };

  // UI
  if (order.fulfillment !== 'delivery') return null;
  return (
    <View style={[{}, style]} {...props}>
      <DefaultText size="lg">Frotas</DefaultText>
      {(fares ?? []).map((fare) =>
        fare.fleet?.id ? (
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
                  {formatCurrency(fare.courier?.netValue ?? 0)}
                </DefaultText>
              </View>
            </RadioCardButton>
          </View>
        ) : null
      )}
      {!fares ? <Loading /> : null}
    </View>
  );
};
