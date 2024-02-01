import { unreadMessagesIds } from '@/api/chats/unreadMessagesIds';
import { useObserveChat } from '@/api/chats/useObserveOrderChat';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { CircledView } from '@/common/components/containers/CircledView';
import { Loading } from '@/common/components/views/Loading';
import { openChat } from '@/common/screens/orders/chat/openChat';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Order, WithId } from '@appjusto/types';
import { router } from 'expo-router';
import { MessageCircle } from 'lucide-react-native';
import { View } from 'react-native';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';

interface Props extends ViewProps {
  order: WithId<Order>;
}

export const OngoingOrderChatHelp = ({ order, style, ...props }: Props) => {
  // state
  const chatWithCourier = useObserveChat(order.id, order?.courier?.id);
  const chatWithBusiness = useObserveChat(order.id, order?.business?.id);
  const hasUnreadMessagesFromCourier = Boolean(
    unreadMessagesIds(chatWithCourier, order?.courier?.id, 'courier')?.length
  );
  const hasUnreadMessagesFromBusiness = Boolean(
    unreadMessagesIds(chatWithBusiness, order?.business?.id, 'business')?.length
  );
  const hasUnreadMessages = hasUnreadMessagesFromCourier || hasUnreadMessagesFromBusiness;
  // UI
  if (!order) return <Loading title="Pedido em andamento" />;
  return (
    <View style={[{ flexDirection: 'row' }, style]} {...props}>
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
        onPress={() => openChat(order, hasUnreadMessagesFromCourier, hasUnreadMessagesFromBusiness)}
      />
      <DefaultButton
        style={{ marginLeft: paddings.sm }}
        title="Ajuda"
        variant="destructive"
        onPress={() =>
          router.push({
            pathname: '/(logged)/(tabs)/(orders)/[id]/incident',
            params: { id: order.id },
          })
        }
      />
    </View>
  );
};
