import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder } from '@/api/orders/context/order-context';

import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { Loading } from '@/common/components/views/Loading';
import { BusinessCart } from '@/common/screens/home/businesses/checkout/business-cart';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Stack } from 'expo-router';

export default function OrderDetailScreen() {
  // context
  const order = useContextOrder();
  const orderId = order?.id;
  // tracking
  useTrackScreenView('Detalhe do Pedido', { orderId });
  // side effects
  // UI
  if (!order) return <Loading title="Detalhe do pedido" />;
  const { code } = order;
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <Stack.Screen options={{ title: `Pedido #${code}` }} />
      <DefaultView style={{ padding: paddings.lg }}>
        <BusinessCart editable={false} />
      </DefaultView>
    </DefaultScrollView>
  );
}
