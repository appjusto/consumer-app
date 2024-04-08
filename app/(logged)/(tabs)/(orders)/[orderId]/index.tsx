import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder } from '@/api/orders/context/order-context';
import { useOrderRoute } from '@/api/orders/navigation/useOrderRoute';
import { Loading } from '@/common/components/views/Loading';

export default function OrderScreen() {
  // context
  const order = useContextOrder();
  // tracking
  useTrackScreenView('Carregando pedido');
  // side effects
  useOrderRoute('ongoing', true);
  // UI
  if (!order) return <Loading title="Pedido em andamento" />;
  return null;
}
