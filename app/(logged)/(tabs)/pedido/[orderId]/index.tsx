import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder } from '@/api/orders/context/order-context';
import { isOrderBeforeConfirmed, isOrderOngoing } from '@/api/orders/status';
import { Loading } from '@/common/components/views/Loading';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function OrderDetailScreen() {
  // context
  const order = useContextOrder();
  const orderId = order?.id;
  const { status, type, paymentMethod } = order ?? {};
  // tracking
  useTrackScreenView('Carregando pedido');
  // side effects
  // context
  // side effects
  useEffect(() => {
    if (!orderId) return;
    if (!status) return;
    console.log('status', status, isOrderBeforeConfirmed(status), isOrderOngoing(status));
    if (isOrderBeforeConfirmed(status)) {
      if (paymentMethod === 'pix') {
        router.replace({
          pathname: '/(logged)/(tabs)/pedido/[orderId]/confirming-pix',
          params: { orderId },
        });
      } else {
        router.replace({
          pathname: '/(logged)/(tabs)/pedido/[orderId]/confirming',
          params: { orderId },
        });
      }
    } else if (status === 'confirmed') {
      if (type === 'food') {
        router.replace({
          pathname: '/(logged)/(tabs)/pedido/[orderId]/confirming',
          params: { orderId },
        });
      } else {
        router.replace({
          pathname: '/(logged)/(tabs)/pedido/[orderId]/ongoing',
          params: { orderId },
        });
      }
    } else if (isOrderOngoing(status)) {
      router.replace({
        pathname: '/(logged)/(tabs)/pedido/[orderId]/ongoing',
        params: { orderId },
      });
    } else {
      router.replace({
        pathname: '/(logged)/(tabs)/pedido/[orderId]/completed',
        params: { orderId },
      });
    }
  }, [orderId, paymentMethod, status, type]);
  // UI
  return <Loading title="Carregando..." />;
}
