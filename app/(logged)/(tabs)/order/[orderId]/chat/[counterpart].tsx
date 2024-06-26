import { useContextApi } from '@/api/ApiContext';
import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { unreadMessagesIds } from '@/api/chats/unreadMessagesIds';
import { useObserveChat } from '@/api/chats/useObserveOrderChat';
import { useContextOrder } from '@/api/orders/context/order-context';
import { useContextProfile } from '@/common/auth/AuthContext';
import { OnlyIconButton } from '@/common/components/buttons/icon/OnlyIconButton';
import { DefaultKeyboardAwareScrollView } from '@/common/components/containers/DefaultKeyboardAwareScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { DefaultInput } from '@/common/components/inputs/default/DefaultInput';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { Time, formatTimestamp } from '@/common/formatters/timestamp';
import { useUniqState } from '@/common/react/useUniqState';
import ProfileImage from '@/common/screens/profile/images/profile-image';
import Selfie from '@/common/screens/profile/images/selfie';
import { ScreenTitle } from '@/common/screens/title/screen-title';
import borders from '@/common/styles/borders';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { Stack, useLocalSearchParams } from 'expo-router';
import { CheckCheck, Send, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';

export default function ChatScreen() {
  // context
  const api = useContextApi();
  const consumer = useContextProfile();
  const consumerId = consumer?.id;
  const order = useContextOrder();
  // params
  const params = useLocalSearchParams<{ id: string; counterpart: string }>();
  const orderId = order?.id;
  const counterpartId = params.counterpart;
  // console.log('chat', counterpartId);
  // state
  const counterpartFlavor = order
    ? counterpartId === order.courier?.id
      ? 'courier'
      : 'business'
    : undefined;
  const counterpartName = order
    ? counterpartId === order.courier?.id
      ? order.courier.name
      : order.business?.name
    : undefined;
  const chat = useObserveChat(orderId, counterpartId);
  const unread = useUniqState(unreadMessagesIds(chat, counterpartId, counterpartFlavor));
  const [message, setMessage] = useState('');
  // tracking
  useTrackScreenView('Chat', { counterpartFlavor }, Boolean(counterpartFlavor));
  // side effects
  useEffect(() => {
    if (!unread?.length) return;
    api
      .chat()
      .updateReadMessages(unread)
      .catch((error: unknown) => {
        console.error(error);
      });
  }, [api, unread]);
  // handlers
  const sendMessage = () => {
    if (!consumerId) return;
    if (!order) return;
    if (!counterpartFlavor) return;
    setMessage('');
    api
      .chat()
      .sendMessage({
        type: counterpartId === order.courier?.id ? 'consumer-courier' : 'business-consumer',
        // order matters
        participantsIds:
          counterpartId === order.courier?.id
            ? [consumerId, counterpartId]
            : [counterpartId, consumerId],
        from: {
          agent: 'consumer',
          id: consumerId,
          name: consumer.name,
        },
        to: {
          agent: counterpartFlavor,
          id: counterpartId,
          name: counterpartName,
        },
        message: message.trim(),
        orderId,
        orderStatus: order.status,
        orderCode: order.code,
      })
      .catch(console.error);
  };
  if (!order) return <ScreenTitle title="Chat" loading />;
  // console.log(JSON.stringify(chat));
  // UI
  return (
    <DefaultView
      style={{
        flex: 1,
      }}
    >
      <Stack.Screen options={{ title: counterpartName }} />
      <DefaultKeyboardAwareScrollView
        // style={{ flex: 1 }}
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: colors.neutral50,
        }}
      >
        <View style={{ padding: paddings.lg }}>
          {chat
            ? chat.map((group) => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: group.from === counterpartId ? 'flex-start' : 'flex-end',
                  }}
                  key={group.id}
                >
                  {/* from courier */}
                  <View>
                    {group.fromFlavor === 'courier' ? <Selfie courierId={group.from} /> : null}
                  </View>
                  {/* business */}
                  <View>
                    {group.fromFlavor === 'business' ? (
                      <ProfileImage path={`businesses/${group.from}/logo_240x240.jpg`} />
                    ) : null}
                  </View>
                  <View style={{}}>
                    {group.messages.map((message) => (
                      <View
                        style={{
                          // borderWidth: 1,
                          flexDirection: 'row',
                          justifyContent: group.from === counterpartId ? 'flex-start' : 'flex-end',
                          marginHorizontal: paddings.md,
                          marginBottom: paddings.sm,
                        }}
                        key={message.id}
                      >
                        <View
                          style={{
                            padding: paddings.md,

                            ...borders.default,
                            backgroundColor:
                              group.from === counterpartId ? colors.white : colors.neutral100,
                            borderColor:
                              group.from === counterpartId ? colors.neutral100 : colors.neutral300,
                          }}
                        >
                          <View>
                            <DefaultText color="neutral900">{message.message}</DefaultText>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                              }}
                            >
                              <DefaultText size="xxs">
                                {message.timestamp ? formatTimestamp(message.timestamp, Time) : ''}
                              </DefaultText>
                              {group.from === consumerId ? (
                                <CheckCheck
                                  style={{ marginLeft: paddings.xs }}
                                  size={16}
                                  color={message.read ? colors.primary500 : colors.neutral500}
                                />
                              ) : null}
                            </View>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                  <View>{group.from === consumerId ? <User /> : null}</View>
                </View>
              ))
            : null}
        </View>
        <SafeAreaView>
          <View
            style={{
              padding: paddings.lg,
              // marginBottom: paddings.lg,
              backgroundColor: colors.white,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flex: 1 }}>
              <DefaultInput
                placeholder="Escreva sua mensagem"
                value={message}
                onChangeText={setMessage}
              />
            </View>
            <OnlyIconButton
              style={{ marginLeft: paddings.sm, backgroundColor: colors.black }}
              icon={<Send color={colors.white} />}
              onPress={sendMessage}
            />
          </View>
        </SafeAreaView>
      </DefaultKeyboardAwareScrollView>
    </DefaultView>
  );
}
