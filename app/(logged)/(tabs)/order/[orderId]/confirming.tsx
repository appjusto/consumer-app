import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder } from '@/api/orders/context/order-context';

import { OrderConfirming } from '@/common/screens/orders/confirming/confirming';

export default function OrderDetailConfirmingScreen() {
  // context
  const order = useContextOrder();
  // tracking
  useTrackScreenView('Detalhe de pedido: confirmando pedido', { orderId: order?.id });
  // side effects
  return <OrderConfirming order={order} />;
}
