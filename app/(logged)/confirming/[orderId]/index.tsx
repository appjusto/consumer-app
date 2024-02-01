import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useObserveOrder } from '@/api/orders/useObserveOrder';
import { LinkButton } from '@/common/components/buttons/link/LinkButton';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { HRShadow } from '@/common/components/views/hr-shadow';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { Image } from 'expo-image';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Dimensions, View } from 'react-native';

const ConfirmingGif = require('../../../../assets/images/order/confirming.gif');

const SIZE = Dimensions.get('screen').width - 100;

export default function OrderCheckoutFeedbackScreen() {
  // params
  const params = useLocalSearchParams<{ orderId: string }>();
  const orderId = params.orderId;
  // state
  const order = useObserveOrder(orderId);
  const status = order?.status;
  const waitingAcceptance = status === 'confirmed';
  // tracking
  useTrackScreenView('Checkout: confirmando pedido', { orderId });
  // side effects
  useEffect(() => {
    console.log(status);
    if (status === 'expired') {
    } else if (status === 'declined') {
    } else if (status === 'rejected') {
    } else if (status === 'canceled') {
    } else if (status === 'preparing' || status === 'ready' || status === 'scheduled') {
      router.replace({
        pathname: '/(logged)/(tabs)/(orders)/[id]/',
        params: { id: orderId },
      });
    }
  }, [status, orderId]);
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
        <View style={{ padding: paddings.lg }}>
          <LinkButton variant="destructive" onPress={() => null}>
            Tive um problema
          </LinkButton>
        </View>
      </View>
    </View>
  );
}
