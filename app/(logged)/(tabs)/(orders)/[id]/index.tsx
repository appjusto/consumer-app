import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useObserveOrder } from '@/api/orders/useObserveOrder';
import { Loading } from '@/common/components/views/Loading';
import { useRouterAccordingOrderStatus } from '@/common/screens/orders/useRouterAccordingOrderStatus';
import { useLocalSearchParams } from 'expo-router';

export default function OrderScreen() {
  // params
  const params = useLocalSearchParams<{ id: string }>();
  const orderId = params.id;
  // state
  const order = useObserveOrder(orderId);
  // tracking
  useTrackScreenView('Carregando pedido');
  // side effects
  useRouterAccordingOrderStatus(order, 'index');
  // UI
  if (!order) return <Loading title="Pedido em andamento" />;
  return null;
}
