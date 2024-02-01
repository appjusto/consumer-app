import { getDispatchingStateFocus } from '@/api/orders/dispatching-state/getDispatchingStateFocus';
import { Order, WithId } from '@appjusto/types';
import { router } from 'expo-router';

export const openChat = (
  order: WithId<Order>,
  hasUnreadMessagesFromCourier: boolean,
  hasUnreadMessagesFromBusiness: boolean
) => {
  let counterpartId = '';
  if (hasUnreadMessagesFromCourier && !hasUnreadMessagesFromBusiness && order.courier?.id) {
    counterpartId = order.courier.id;
  } else if (hasUnreadMessagesFromBusiness && !hasUnreadMessagesFromCourier && order.business?.id) {
    counterpartId = order.business.id;
  } else if (order.type === 'p2p' && order.courier?.id) {
    counterpartId = order.courier.id;
  } else if (getDispatchingStateFocus(order.dispatchingState) === 'pickup' && order.business?.id) {
    counterpartId = order.business.id;
  }
  if (counterpartId) {
    router.push({
      pathname: '/(logged)/(tabs)/(orders)/[id]/chat/[counterpart]',
      params: { id: order.id, counterpart: counterpartId },
    });
  } else {
    router.push({
      pathname: '/(logged)/(tabs)/(orders)/[id]/chat-picker',
      params: {
        id: order.id,
        courierId: order.courier?.id ?? '',
        businessId: order.business?.id ?? '',
        hasUnreadMessagesFromConsumer: `${hasUnreadMessagesFromCourier}`,
        hasUnreadMessagesFromBusiness: `${hasUnreadMessagesFromBusiness}`,
      },
    });
  }
};
