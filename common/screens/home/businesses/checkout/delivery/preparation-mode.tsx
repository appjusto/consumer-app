import { useContextApi } from '@/api/ApiContext';
import { getBusinessAvailability } from '@/api/business/range/getBusinessAvailability';
import { checkoutHasIssue } from '@/api/orders/checkout/checkoutHasIssue';
import { useCheckoutIssues } from '@/api/orders/checkout/useCheckoutIssues';
import { useContextOrderBusiness } from '@/api/orders/context/order-context';
import { useContextGetServerTime } from '@/api/platform/context/platform-context';
import { RadioCardButton } from '@/common/components/buttons/radio/radio-card-button';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HR } from '@/common/components/views/HR';
import { MessageBox } from '@/common/components/views/MessageBox';
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
  const business = useContextOrderBusiness();
  const getServerTime = useContextGetServerTime();
  // state
  const issues = useCheckoutIssues(true, false);
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
    router.navigate({
      pathname: '/(logged)/checkout/[orderId]/schedule',
      params: { orderId: order.id },
    });
  };
  // UI
  const businessRealtime =
    business &&
    business.preparationModes?.includes('realtime') === true &&
    getBusinessAvailability(business, getServerTime()) === 'open';
  const businessScheduled = business?.preparationModes?.includes('scheduled') === true;
  const realtime = order.type === 'p2p' || businessRealtime;
  const scheduled = order.type === 'p2p' || businessScheduled;
  const estimate = order.arrivals?.destination?.estimate;
  // logs
  // console.log(issues);
  // console.log('PreparationMode', 'business?.preparationModes', business?.preparationModes);
  // console.log('PreparationMode', 'business?.preparationModes', realtime, scheduled);
  // console.log(
  //   'PreparationMode',
  //   getBusinessAvailability(business, getServerTime())
  // );
  return (
    <View style={[{}, style]} {...props}>
      <DefaultText size="lg">Horário da entrega</DefaultText>
      {realtime ? (
        <View style={{ marginTop: paddings.lg }}>
          <RadioCardButton onPress={updateToRealtime} checked={!order.scheduledTo}>
            <DefaultText size="md" color="black">
              Padrão
            </DefaultText>
            <DefaultText style={{ marginTop: paddings.xs }}>{`Hoje${
              estimate ? ', ' + timestampWithETA(estimate) : ''
            }`}</DefaultText>
          </RadioCardButton>
        </View>
      ) : null}
      {scheduled ? (
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
      {checkoutHasIssue(issues, 'schedule-required') ? (
        <MessageBox style={{ marginTop: paddings.lg }} variant="warning">
          {issues.find((issue) => issue.type === 'schedule-required')?.description}
        </MessageBox>
      ) : null}
      <HR style={{ marginTop: paddings.xl }} />
    </View>
  );
};
