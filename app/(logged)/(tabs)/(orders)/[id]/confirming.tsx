import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useObserveBusiness } from '@/api/business/useObserveBusiness';
import { useObserveOrder } from '@/api/orders/useObserveOrder';
import { LinkButton } from '@/common/components/buttons/link/LinkButton';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HRShadow } from '@/common/components/views/hr-shadow';
import { useRouterAccordingOrderStatus } from '@/common/screens/orders/useRouterAccordingOrderStatus';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Image } from 'expo-image';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { AlertOctagon, Phone } from 'lucide-react-native';
import { Dimensions, Linking, View } from 'react-native';

const ConfirmingGif = require('../../../../../assets/images/order/confirming.gif');

const SIZE = Dimensions.get('screen').width - 100;

export default function OrderConfirmingScreen() {
  // params
  const params = useLocalSearchParams<{ id: string }>();
  const orderId = params.id;
  // state
  const order = useObserveOrder(orderId);
  const businessPhone = useObserveBusiness(order?.business?.id)?.phone;
  const status = order?.status;
  const waitingAcceptance = status === 'confirmed';
  // tracking
  useTrackScreenView('Checkout: confirmando pedido', { orderId });
  // side effects
  useRouterAccordingOrderStatus(order, 'confirming');
  // handlers
  const callBusinessHandler = () => {
    Linking.openURL(`tel:${businessPhone}`)
      .then(() => null)
      .catch((error) => console.error(error));
  };
  const problemHandler = () => {
    router.push({
      pathname: '/(logged)/(tabs)/(orders)/[id]/incident',
      params: { id: orderId },
    });
  };
  // UI
  return (
    <View style={{ ...screens.centered }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1 }} />
      <View style={{ flex: 1, borderWidth: 0 }}>
        <Image style={{ width: SIZE, height: SIZE }} contentFit="cover" source={ConfirmingGif} />
        <View style={{ flex: 1 }} />
        <DefaultText style={{ textAlign: 'center' }} size="md">
          {waitingAcceptance ? 'Aguardando aceite do restaurante...' : 'Criando o seu pedido...'}
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
}
