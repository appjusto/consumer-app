import { useContextApi } from '@/api/ApiContext';
import { isOrderOngoing } from '@/api/orders/status';
import { getOrderTimestamp } from '@/api/orders/timestamp/getOrderTime';
import { getOrderTotalCost } from '@/api/orders/total/getOrderTotalCost';
import { LinkButton } from '@/common/components/buttons/link/LinkButton';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HR } from '@/common/components/views/HR';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { formatCurrency } from '@/common/formatters/currency';
import { formatTimestamp } from '@/common/formatters/timestamp';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Order, WithId } from '@appjusto/types';
import { router } from 'expo-router';
import { pick } from 'lodash';
import { View, ViewProps } from 'react-native';
import { OrderStatusBadge } from '../status/order-status-badge';

interface Props extends ViewProps {
  order: WithId<Order>;
}

export const P2POrder = ({ order, style, ...props }: Props) => {
  // params
  const { type, code, status } = order;
  // context
  const api = useContextApi();
  const showToast = useShowToast();
  // handlers
  const createOrderHandler = () => {
    api
      .orders()
      .createP2POrder({
        ...pick(order, ['origin', 'destination']),
      })
      .then((orderId) => {
        showToast('Pedido criado com sucesso!', 'success');
        router.navigate({
          pathname: '/(logged)/checkout/[orderId]/',
          params: { orderId },
        });
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : 'Não foi possível criar o pedido';
        showToast(message, 'error');
      });
  };
  // UI
  return (
    <View
      style={[
        {
          padding: paddings.lg,
          marginBottom: paddings.lg,
          backgroundColor: colors.white,
          borderRadius: 8,
          borderColor: colors.neutral100,
          borderWidth: 1,
        },
        style,
      ]}
      {...props}
    >
      {/* header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <DefaultText size="xs" color="neutral700">
            {`#${code}`}
          </DefaultText>
          <DefaultText style={{ marginTop: paddings.xs }} size="md" color="neutral900">
            Encomenda
          </DefaultText>
        </View>
        <View>
          <OrderStatusBadge type={type} status={status} />
        </View>
      </View>
      {/* products */}
      <View style={{ marginTop: paddings.lg }}>
        <View style={{ flexDirection: 'row' }}>
          <DefaultText color="neutral800">Origem</DefaultText>
          <DefaultText style={{ marginLeft: paddings.lg }}>
            {order.origin?.address.main}
          </DefaultText>
        </View>
        <View style={{ flexDirection: 'row', marginTop: paddings.md }}>
          <DefaultText color="neutral800">Destino</DefaultText>
          <DefaultText style={{ marginLeft: paddings.lg }}>
            {order.destination?.address.main}
          </DefaultText>
        </View>
      </View>
      <HR style={{ marginTop: paddings.lg }} />
      {/* time & price */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: paddings.md,
        }}
      >
        <DefaultText size="xs" color="neutral700">
          {formatTimestamp(getOrderTimestamp(order))}
        </DefaultText>
        <DefaultText size="md" color="neutral900">
          {formatCurrency(getOrderTotalCost(order))}
        </DefaultText>
      </View>
      {/* controls */}
      {!isOrderOngoing(status) ? (
        <View>
          <HR />
          <View
            style={{
              // flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: paddings.md,
              // borderWidth: 1,
            }}
          >
            <LinkButton variant="ghost" onPress={createOrderHandler}>
              Pedir novamente
            </LinkButton>
          </View>
        </View>
      ) : null}
    </View>
  );
};
