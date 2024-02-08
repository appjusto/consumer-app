import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { getOrderStage } from '@/api/orders/status';
import { useObserveOrder } from '@/api/orders/useObserveOrder';
import { Loading } from '@/common/components/views/Loading';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

export default function OrderScreen() {
  // params
  const params = useLocalSearchParams<{ id: string }>();
  const orderId = params.id;
  // state
  const order = useObserveOrder(orderId);
  const status = order?.status;
  const type = order?.type;
  // tracking
  useTrackScreenView('Carregando pedido');
  // side effects
  useEffect(() => {
    if (!status) return;
    if (!type) return;
    const stage = getOrderStage(status, type);
    if (stage === 'confirming') {
      router.replace({
        pathname: '/(logged)/(tabs)/(orders)/[id]/confirming',
        params: { id: orderId },
      });
    } else if (stage === 'ongoing') {
      router.replace({
        pathname: '/(logged)/(tabs)/(orders)/[id]/ongoing',
        params: { id: orderId },
      });
    } else if (stage === 'completed') {
      router.replace({
        pathname: '/(logged)/(tabs)/(orders)/[id]/delivered',
        params: { id: orderId },
      });
    } else {
      router.back();
    }
  }, [orderId, status, type]);
  // UI
  if (!order) return <Loading title="Pedido em andamento" />;
  return null;
}
