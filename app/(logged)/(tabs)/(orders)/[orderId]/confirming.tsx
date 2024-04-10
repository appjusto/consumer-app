import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useObserveBusiness } from '@/api/business/useObserveBusiness';
import { useContextOrder } from '@/api/orders/context/order-context';
import { useOrderRoute } from '@/api/orders/navigation/useOrderRoute';
import { LinkButton } from '@/common/components/buttons/link/LinkButton';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HRShadow } from '@/common/components/views/hr-shadow';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Stack, router } from 'expo-router';
import { AlertOctagon, Phone } from 'lucide-react-native';
import { Dimensions, Linking, View } from 'react-native';

import LottieView from 'lottie-react-native';

// const ConfirmingGif = require('../../../../../assets/images/order/confirming.gif');
const ConfirmingJSON = require('../../../../../assets/images/order/confirming.lottie.json');

const SIZE = Dimensions.get('screen').width - 100;

export default function OrderConfirmingScreen() {
  // context
  const order = useContextOrder();
  const orderId = order?.id;
  const status = order?.status;
  const waitingAcceptance = status === 'confirmed';
  // state
  const businessPhone = useObserveBusiness(order?.business?.id)?.phone;
  // tracking
  useTrackScreenView('Checkout: confirmando pedido', { orderId });
  // side effects
  useOrderRoute('confirming');
  // handlers
  const callBusinessHandler = () => {
    Linking.openURL(`tel:${businessPhone}`)
      .then(() => null)
      .catch((error) => console.error(error));
  };
  const problemHandler = () => {
    if (!orderId) return;
    router.push({
      pathname: '/(logged)/(tabs)/(orders)/[orderId]/help',
      params: { orderId },
    });
  };
  // UI
  return (
    <View style={{ ...screens.centered }}>
      <Stack.Screen options={{ title: 'Criando pedido', headerShown: true }} />
      <View style={{ flex: 0.5 }} />
      <View style={{ flex: 1, borderWidth: 0 }}>
        {/* <Image style={{ width: SIZE, height: SIZE }} contentFit="cover" source={ConfirmingGif} /> */}
        <LottieView autoPlay style={{ width: SIZE, height: SIZE }} source={ConfirmingJSON} />
        {/* <View style={{ flex: 1 }} /> */}
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
