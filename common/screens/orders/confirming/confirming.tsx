import { useObserveBusiness } from '@/api/business/useObserveBusiness';
import { LinkButton } from '@/common/components/buttons/link/LinkButton';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HRShadow } from '@/common/components/views/hr-shadow';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { isLargeScreen } from '@/common/version/device';
import { Order, WithId } from '@appjusto/types';
import { Stack, router, useSegments } from 'expo-router';
import LottieView from 'lottie-react-native';
import { AlertOctagon, MessageSquareText, Phone } from 'lucide-react-native';
import { Dimensions, Linking, View, ViewProps } from 'react-native';
import { useOrderConfirming } from './useOrderConfirming';

const ConfirmingJSON = require('../../../../assets/images/order/confirming.lottie.json');

const SIZE = Dimensions.get('screen').width - (isLargeScreen() ? 100 : 150);

interface Props extends ViewProps {
  order: WithId<Order> | undefined | null;
}

export const OrderConfirming = ({ order, style, ...props }: Props) => {
  // params
  const { status, type } = order ?? {};
  const orderId = order?.id;
  const waitingAcceptance = type === 'food' && status === 'confirmed';
  const segments = useSegments();
  const ordersTab = segments.some((value) => value === 'order');
  // state
  const business = useObserveBusiness(order?.business?.id);
  const businessPhone = business?.phone;
  const businessWhatsapp = business?.whatsapp;
  // side effects
  useOrderConfirming();
  // handlers
  const callBusinessHandler = () => {
    Linking.openURL(`tel:${businessPhone}`)
      .then(() => null)
      .catch((error) => console.error(error));
  };
  const whatsappBusinessHandler = () => {
    Linking.openURL(`https://wa.me/55${businessWhatsapp}`)
      .then(() => null)
      .catch((error) => console.error(error));
  };
  const problemHandler = () => {
    if (!orderId) return;
    router.navigate({
      pathname: '/(logged)/(tabs)/order/[orderId]/help',
      params: { orderId },
    });
  };
  // UI
  if (!order) {
    return (
      <View>
        <Stack.Screen options={{ title: 'Criando pedido', headerShown: ordersTab }} />
      </View>
    );
  }
  return (
    <View style={[{ ...screens.centered }, style]} {...props}>
      <Stack.Screen options={{ title: 'Criando pedido', headerShown: ordersTab }} />
      <View style={{ flex: 0.5 }} />
      <View
        style={{
          flex: 1,
          borderWidth: 0,
          marginTop: isLargeScreen() ? 100 : 0,
          alignItems: 'center',
        }}
      >
        {/* <Image style={{ width: SIZE, height: SIZE }} contentFit="cover" source={ConfirmingGif} /> */}
        <LottieView autoPlay style={{ width: SIZE, height: SIZE }} source={ConfirmingJSON} />
        {/* <View style={{ flex: 1 }} /> */}
        <DefaultText style={{ textAlign: 'center' }} size="md">
          {waitingAcceptance ? 'Aguardando aceite do restaurante...' : 'Criando seu pedido...'}
        </DefaultText>
      </View>
      <View style={{ flex: 1 }} />
      <HRShadow />
      <View>
        <View style={{ padding: paddings.lg, alignItems: 'center' }}>
          {businessPhone ? (
            <LinkButton
              style={{ marginBottom: paddings.lg }}
              variant="ghost"
              leftView={
                <Phone style={{ marginRight: paddings.sm }} size={16} color={colors.black} />
              }
              onPress={callBusinessHandler}
            >
              Ligar para restaurante
            </LinkButton>
          ) : null}
          {businessWhatsapp ? (
            <LinkButton
              style={{ marginBottom: paddings.lg }}
              variant="ghost"
              leftView={
                <MessageSquareText
                  style={{ marginRight: paddings.sm }}
                  size={16}
                  color={colors.black}
                />
              }
              onPress={whatsappBusinessHandler}
            >
              Enviar mensagem
            </LinkButton>
          ) : null}
          <LinkButton
            variant="destructive"
            leftView={
              <AlertOctagon
                style={{ marginRight: paddings.sm }}
                size={16}
                color={colors.error500}
              />
            }
            onPress={problemHandler}
          >
            Tive um problema
          </LinkButton>
        </View>
      </View>
    </View>
  );
};
