import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder } from '@/api/orders/context/order-context';
import { OrderConfirming } from '@/common/screens/orders/confirming/confirming';

export default function OrderCheckoutConfirmingScreen() {
  // context
  const order = useContextOrder();
  // tracking
  useTrackScreenView('Checkout: confirmando pedido', { orderId: order?.id });
  // side effects
  return <OrderConfirming order={order} />;
}
