import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder } from '@/api/orders/context/order-context';
import { OrderConfirmingPix } from '@/common/screens/orders/confirming/confirming-pix';

export default function OrderDetailConfirmingPixScreen() {
  // context
  const order = useContextOrder();
  const orderId = order?.id;
  // tracking
  useTrackScreenView('Checkout: confirmando pix', { orderId });
  // UI
  return <OrderConfirmingPix />;
}
