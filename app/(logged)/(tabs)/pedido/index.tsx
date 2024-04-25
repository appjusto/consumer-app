import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { routeOrder } from '@/api/orders/navigation/routeOrder';
import { useObserveOrdersFromPeriod } from '@/api/orders/useObserveOrdersFromPeriod';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { Loading } from '@/common/components/views/Loading';
import { getEndOfDay, getStartOfDay } from '@/common/date';
import { OrderList } from '@/common/screens/orders/list/order-list';
import { PeriodControl } from '@/common/screens/orders/period-control/period-control';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Order, WithId } from '@appjusto/types';
import { Stack } from 'expo-router';
import { isEqual } from 'lodash';
import { useCallback, useRef, useState } from 'react';

export const Title = ({ title, loading }: { title: string; loading: boolean }) => (
  <>
    <Stack.Screen options={{ title, headerBackTitleVisible: false }} />
    {loading ? <Loading /> : null}
  </>
);

export default function OrdersIndex() {
  // tracking
  useTrackScreenView('Pedidos');
  // state
  const startOfDay = useRef(getStartOfDay())?.current;
  const endOfDay = useRef(getEndOfDay())?.current;
  const [from, setFrom] = useState(startOfDay);
  const [to, setTo] = useState(endOfDay);
  const orders = useObserveOrdersFromPeriod(from, to);
  // handlers
  const changeHandler = useCallback(
    (_from: Date, _to: Date) => {
      // console.log('changeHandler', _from, _to);
      if (!isEqual(from, _from)) {
        setFrom(_from);
      }
      if (!isEqual(to, _to)) {
        setTo(_to);
      }
    },
    [from, to]
  );
  const handleClick = (order: WithId<Order>) => {
    // console.log('handleClick', order.id);
    routeOrder(order.id, order.status, order.type, order.paymentMethod);
  };
  if (!orders) return <Title title="Pedidos" loading />;
  // UI
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <Title title="Pedidos" loading={false} />
      <DefaultView
        style={{ ...screens.headless, padding: paddings.lg, backgroundColor: colors.neutral50 }}
      >
        <PeriodControl onChange={changeHandler} />
        <OrderList orders={orders} onPress={handleClick} />
      </DefaultView>
    </DefaultScrollView>
  );
}
