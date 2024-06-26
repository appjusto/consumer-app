import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextOrder } from '@/api/orders/context/order-context';
import { useObservePendingPayment } from '@/api/orders/payment/useObservePendingPayment';
import { getOrderTotalCost } from '@/api/orders/total/getOrderTotalCost';
import { DefaultButton } from '@/common/components/buttons/default/DefaultButton';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { PendingSteps } from '@/common/components/pending/PendingSteps';
import { DefaultText } from '@/common/components/texts/DefaultText';
import { MessageBox } from '@/common/components/views/MessageBox';
import { HRShadow } from '@/common/components/views/hr-shadow';
import { useShowToast } from '@/common/components/views/toast/ToastContext';
import { formatCurrency } from '@/common/formatters/currency';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { IuguPayment } from '@appjusto/types';
import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import { Stack, useSegments } from 'expo-router';
import { Copy } from 'lucide-react-native';
import { ActivityIndicator, View } from 'react-native';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';
import { useOrderConfirming } from './useOrderConfirming';

const STEPS = [
  'Clique no botão "Copiar código Pix"',
  'Acesse o aplicativo ou site do seu banco;',
  'Procure pela opção de PIX copia e cola e confirme o pagamento',
];

interface Props extends ViewProps {}

export const OrderConfirmingPix = ({ style, ...props }: Props) => {
  // context
  const showToast = useShowToast();
  const order = useContextOrder();
  const orderId = order?.id;
  const segments = useSegments();
  const ordersTab = segments.some((value) => value === 'order');
  // state
  const pendingPayment = useObservePendingPayment(orderId);
  const pix = pendingPayment?.processor === 'iugu' ? (pendingPayment as IuguPayment).pix : null;
  // side effects
  useOrderConfirming();
  // handlers
  const copyToClipboard = () => {
    if (!pix?.qrcodeText) return;
    Clipboard.setStringAsync(pix.qrcodeText).then(() => {
      showToast('PIX copia e cola copiado com sucesso!', 'success');
    });
  };
  // tracking
  useTrackScreenView('Checkout: confirmando pix', { orderId });
  if (!order) {
    return (
      <View>
        <Stack.Screen options={{ title: 'Criando pedido', headerShown: ordersTab }} />
      </View>
    );
  }
  const value = pendingPayment?.value ?? getOrderTotalCost(order);
  // UI
  return (
    <View style={{ ...screens.headless }}>
      <Stack.Screen options={{ title: 'PIX', headerShown: ordersTab }} />
      <DefaultScrollView style={{ flex: 1 }}>
        <DefaultView style={{ padding: paddings.lg }}>
          <DefaultText style={{ marginTop: paddings.xl, textAlign: 'center' }} size="lg">
            Pagamento com PIX
          </DefaultText>
          {/* steps */}
          <View style={{ marginTop: paddings.xl }}>
            <PendingSteps steps={STEPS} index={-1} />
          </View>
          {/* qrcode */}
          <View
            style={{
              marginVertical: paddings.xl,
              padding: paddings.lg,
              justifyContent: 'center',
              alignSelf: 'center',
            }}
          >
            {/* <DefaultText style={{ textAlign: 'center' }}>Válido por 30 minutos</DefaultText> */}
            {pix?.qrcode ? (
              <View>
                <View style={{ padding: paddings.lg }}>
                  <Image
                    source={{ uri: pix.qrcode }}
                    style={{ height: 150, width: 150 }}
                    cachePolicy="none"
                  />
                </View>
                <DefaultButton
                  title="Copiar código Pix"
                  variant="outline"
                  onPress={copyToClipboard}
                  rightView={
                    <Copy style={{ marginLeft: paddings.xs }} color={colors.black} size={16} />
                  }
                />
              </View>
            ) : (
              <ActivityIndicator size="small" color={colors.black} />
            )}
          </View>
          {/* warning */}
          <MessageBox variant="info">
            Após o pagamento, você será redirecionado para a tela de acompanhamento do pedido.
          </MessageBox>
        </DefaultView>
      </DefaultScrollView>
      <View>
        <HRShadow />
        <View
          style={{
            padding: paddings.lg,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: paddings.xl,
          }}
        >
          <DefaultText size="md" color="black">
            Aguardando pagamento
          </DefaultText>
          <DefaultText size="md" color="black">
            {formatCurrency(value)}
          </DefaultText>
        </View>
      </View>
    </View>
  );
};
