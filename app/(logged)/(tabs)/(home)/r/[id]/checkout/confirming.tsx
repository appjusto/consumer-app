import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { OrderCheckoutFeedbackScreenView } from '@/common/screens/orders/checkout/feedback/order-checkout-feedback-screen';
import { useLocalSearchParams } from 'expo-router';

export default function OrderCheckoutFeedbackScreen() {
  // params
  const params = useLocalSearchParams<{ orderId: string }>();
  const orderId = params.orderId;
  // tracking
  useTrackScreenView('Checkout: confirmando pedido', { orderId });
  // UI
  return <OrderCheckoutFeedbackScreenView orderId={orderId} />;
}
