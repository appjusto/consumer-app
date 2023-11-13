import { View } from 'react-native';

import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { unreadMessagesIds } from '@/api/chats/unreadMessagesIds';
import { useObserveChat } from '@/api/chats/useObserveOrderChat';
import { useObserveOrder } from '@/api/orders/useObserveOrder';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { CircledView } from '@/common/components/containers/CircledView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { HR } from '@/common/components/views/HR';
import { Loading } from '@/common/components/views/Loading';
import { openChat } from '@/common/screens/orders/chat/openChat';
import { OrderMap } from '@/common/screens/orders/map/order-map';
import { useRouterAccordingOrderStatus } from '@/common/screens/orders/useRouterAccordingOrderStatus';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { MessageCircle } from 'lucide-react-native';

export default function OngoingOrderScreen() {
  // params
  const params = useLocalSearchParams<{ id: string }>();
  const orderId = params.id;
  // state
  const order = useObserveOrder(orderId);
  const orderStatus = order?.status;
  const dispatchingState = order?.dispatchingState;
  const chatWithCourier = useObserveChat(orderId, order?.courier?.id);
  const chatWithBusiness = useObserveChat(orderId, order?.business?.id);
  const hasUnreadMessagesFromCourier = Boolean(
    unreadMessagesIds(chatWithCourier, order?.courier?.id, 'courier')?.length
  );
  const hasUnreadMessagesFromBusiness = Boolean(
    unreadMessagesIds(chatWithBusiness, order?.business?.id, 'business')?.length
  );
  const hasUnreadMessages = hasUnreadMessagesFromCourier || hasUnreadMessagesFromBusiness;
  // tracking
  useTrackScreenView('Pedido em andamento');
  // side effects
  const view = useRouterAccordingOrderStatus(orderId, orderStatus, true);
  // UI
  if (!order) return <Loading title="Pedido em andamento" />;
  return (
    <DefaultView style={{ ...screens.default }}>
      <Stack.Screen options={{ title: `Pedido #${order.code}` }} />
      {view}
      <OrderMap order={order} />
      <View
        style={{
          flex: dispatchingState === 'arrived-destination' ? 1 : undefined,
          marginTop: paddings.lg,
        }}
      >
        {/* header */}
        <View
          style={{
            padding: paddings.lg,
            flexDirection: 'row',
          }}
        >
          {/* consumer name */}
          <View></View>
          {/* controls */}
          <View style={{ flex: 1 }} />
          <View style={{ flexDirection: 'row' }}>
            <DefaultButton
              title="Chat"
              buttonStyle={{
                borderColor: hasUnreadMessages ? colors.primary100 : undefined,
                backgroundColor: hasUnreadMessages ? colors.primary100 : colors.white,
              }}
              variant="outline"
              rightView={
                <View style={{ marginLeft: paddings.sm }}>
                  <MessageCircle size={16} color="black" />
                  {hasUnreadMessages ? (
                    <CircledView
                      style={{
                        position: 'absolute',
                        right: 0,
                        backgroundColor: colors.primary500,
                        borderColor: colors.primary500,
                      }}
                      size={8}
                    />
                  ) : null}
                </View>
              }
              onPress={() =>
                openChat(order, hasUnreadMessagesFromCourier, hasUnreadMessagesFromBusiness)
              }
            />
            <DefaultButton
              style={{ marginLeft: paddings.sm }}
              title="Ajuda"
              variant="destructive"
              onPress={() => {
                router.push({
                  pathname: '/(logged)/order/[id]/support',
                  params: { id: orderId },
                });
              }}
            />
          </View>
        </View>
        <HR style={{ marginTop: paddings.lg }} />
        {/* address */}
        {/* controls */}
        {/* <View style={{ flex: 1 }} /> */}
      </View>
    </DefaultView>
  );
}
