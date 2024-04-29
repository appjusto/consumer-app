import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { CircledView } from '@/common/components/containers/CircledView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import DefaultCard from '@/common/components/views/cards/DefaultCard';
import { DefaultCardIcon, IconName } from '@/common/components/views/cards/icon';
import { ScreenTitle } from '@/common/screens/title/screen-title';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  title: string;
  iconName: IconName;
  hasUnreadMessages: boolean;
}

export const ChatCard = ({ title, iconName, hasUnreadMessages, style, ...props }: Props) => {
  return (
    <DefaultCard
      style={[
        {
          backgroundColor: hasUnreadMessages ? colors.primary100 : colors.white,
          borderColor: hasUnreadMessages ? colors.primary300 : colors.neutral100,
        },
        style,
      ]}
      {...props}
      icon={
        <View>
          <DefaultCardIcon iconName={iconName} variant={hasUnreadMessages ? 'white' : 'lighter'} />
          {hasUnreadMessages ? (
            <CircledView
              style={{
                position: 'absolute',
                right: 5,
                top: 5,
                backgroundColor: colors.primary500,
                borderColor: colors.primary500,
              }}
              size={8}
            />
          ) : null}
        </View>
      }
      title={title}
    />
  );
};

export default function ChatPickerScreen() {
  // params
  const params = useLocalSearchParams<{
    orderId: string;
    courierId: string;
    businessId: string;
    hasUnreadMessagesFromCourier: string;
    hasUnreadMessagesFromBusiness: string;
  }>();
  const { orderId, courierId, businessId } = params;
  const hasUnreadMessagesFromCourier = params.hasUnreadMessagesFromCourier === 'true';
  const hasUnreadMessagesFromBusiness = params.hasUnreadMessagesFromBusiness === 'true';
  useTrackScreenView('Escolher Chat', { orderId });
  // handlers
  const openChat = (counterpartId: string) =>
    router.replace({
      pathname: '/(logged)/(tabs)/order/[orderId]/chat/[counterpart]',
      params: { orderId, counterpart: counterpartId },
    });
  // UI
  return (
    <DefaultView
      style={{
        paddingHorizontal: paddings.lg,
        paddingVertical: paddings.xl,
        backgroundColor: colors.neutral50,
      }}
    >
      <ScreenTitle title="Chat" />
      {businessId ? (
        <Pressable onPress={() => openChat(businessId)}>
          {() => (
            <ChatCard
              title="Chat com restaurante"
              iconName="utentils"
              hasUnreadMessages={hasUnreadMessagesFromBusiness}
            />
          )}
        </Pressable>
      ) : null}
      {courierId ? (
        <Pressable onPress={() => openChat(courierId)}>
          {() => (
            <ChatCard
              style={{ marginTop: paddings.lg }}
              title="Chat com entregador"
              iconName="fleets"
              hasUnreadMessages={hasUnreadMessagesFromCourier}
            />
          )}
        </Pressable>
      ) : null}
    </DefaultView>
  );
}
