import { useContextApi } from '@/api/ApiContext';
import { useContextBusiness } from '@/api/business/context/business-context';
import { RadioCardButton } from '@/common/components/buttons/radio/radio-card-button';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HR } from '@/common/components/views/HR';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { timestampWithETA } from '@/common/formatters/timestamp';
import paddings from '@/common/styles/paddings';
import { Dayjs } from '@appjusto/dates';
import { Order, WithId } from '@appjusto/types';
import crashlytics from '@react-native-firebase/crashlytics';
import { router } from 'expo-router';
import { capitalize } from 'lodash';
import { Pressable, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  order: WithId<Order>;
}

export const PreparationMode = ({ order, style, ...props }: Props) => {
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  const business = useContextBusiness();
  // handlers
  const updateToRealtime = () => {
    api
      .orders()
      .updateOrder(order.id, { scheduledTo: null })
      .catch((error) => {
        console.error(error);
        if (error instanceof Error) crashlytics().recordError(error);
        showToast('Não foi possível atualizar a forma de entrega. Tente novamente.', 'error');
      });
  };
  const scheduleOrder = () => {
    if (!business) return;
    router.navigate({
      pathname: '/(logged)/(tabs)/(home)/r/[id]/checkout/schedule',
      params: { id: business.id },
    });
  };
  // UI
  if (!business) return;
  return (
    <View style={[{}, style]} {...props}>
      <DefaultText size="lg">Horário da entrega</DefaultText>
      {business.preparationModes?.includes('realtime') && order.arrivals?.destination?.estimate ? (
        <View style={{ marginTop: paddings.lg }}>
          <RadioCardButton onPress={updateToRealtime} checked={!order.scheduledTo}>
            <DefaultText size="md" color="black">
              Padrão
            </DefaultText>
            <DefaultText style={{ marginTop: paddings.xs }}>{`Hoje, ${timestampWithETA(
              order.arrivals.destination.estimate
            )}`}</DefaultText>
          </RadioCardButton>
        </View>
      ) : null}
      {business.preparationModes?.includes('scheduled') ? (
        <View style={{ marginTop: paddings.lg }}>
          <RadioCardButton onPress={scheduleOrder} checked={Boolean(order.scheduledTo)}>
            <DefaultText size="md" color="black">
              Agendada
            </DefaultText>
            {order.scheduledTo ? (
              <DefaultText style={{ marginTop: paddings['2xs'] }} color="neutral800">
                {`${capitalize(
                  Dayjs(order.scheduledTo.toDate()).calendar()
                )}, dia ${order.scheduledTo.toDate().getDate()}, ${timestampWithETA(
                  order.scheduledTo
                )}`}
              </DefaultText>
            ) : null}
            <Pressable onPress={scheduleOrder}>
              <DefaultText style={{ marginTop: paddings.xs }} color="black">{`${
                order.scheduledTo ? 'Trocar' : 'Definir'
              } horário`}</DefaultText>
            </Pressable>
          </RadioCardButton>
        </View>
      ) : null}
      <HR style={{ marginTop: paddings.xl }} />
    </View>
  );
};
