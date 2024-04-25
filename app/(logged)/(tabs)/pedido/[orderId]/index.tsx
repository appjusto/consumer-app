import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder } from '@/api/orders/context/order-context';
import { routeOrder } from '@/api/orders/navigation/routeOrder';
import { Loading } from '@/common/components/views/Loading';
import { useEffect } from 'react';

export default function OrderDetailScreen() {
  // context
  const order = useContextOrder();
  const orderId = order?.id;
  const { status, type, paymentMethod } = order ?? {};
  // tracking
  useTrackScreenView('Carregando pedido');
  // side effects
  useEffect(() => {
    if (!orderId) return;
    if (!status) return;
    routeOrder(orderId, status, type, paymentMethod);
  }, [orderId, paymentMethod, status, type]);
  // UI
  return <Loading title="Carregando..." />;
}
