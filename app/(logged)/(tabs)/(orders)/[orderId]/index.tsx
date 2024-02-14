import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder } from '@/api/orders/context/order-context';
import { getOrderStage } from '@/api/orders/status';
import { Loading } from '@/common/components/views/Loading';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function OrderScreen() {
  // context
  const order = useContextOrder();
  const orderId = order?.id;
  // state
  const status = order?.status;
  const type = order?.type;
  // tracking
  useTrackScreenView('Carregando pedido');
  // side effects
  useEffect(() => {
    if (!status) return;
    if (!type) return;
    if (!orderId) return;
    const stage = getOrderStage(status, type);
    if (stage === 'placing') {
      router.replace({
        pathname: '/(logged)/(tabs)/(orders)/[orderId]/confirming',
        params: { orderId },
      });
    } else if (stage === 'ongoing') {
      router.replace({
        pathname: '/(logged)/(tabs)/(orders)/[orderId]/ongoing',
        params: { orderId },
      });
    } else if (stage === 'completed') {
      router.replace({
        pathname: '/(logged)/(tabs)/(orders)/[orderId]/delivered',
        params: { orderId },
      });
    } else {
      router.back();
    }
  }, [orderId, status, type]);
  // UI
  if (!order) return <Loading title="Pedido em andamento" />;
  return null;
}
