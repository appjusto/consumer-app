import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder } from '@/api/orders/context/order-context';

import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { BusinessCart } from '@/common/screens/home/businesses/checkout/business-cart';
import { ScreenTitle } from '@/common/screens/title/screen-title';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';

export default function OrderDetailScreen() {
  // context
  const order = useContextOrder();
  const orderId = order?.id;
  // tracking
  useTrackScreenView('Detalhe do Pedido', { orderId });
  // side effects
  // UI
  if (!order) return <ScreenTitle title="Detalhe do pedido" loading />;
  const { code } = order;
  return (
    <DefaultScrollView style={{ ...screens.default }}>
      <ScreenTitle title={`Pedido #${code}`} />
      <DefaultView style={{ padding: paddings.lg }}>
        <BusinessCart order={order} editable={false} />
      </DefaultView>
    </DefaultScrollView>
  );
}
