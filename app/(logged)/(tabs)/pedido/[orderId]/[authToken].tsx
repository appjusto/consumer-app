import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { getAppjustoURL } from '@/common/constants/urls';
import { ScreenTitle } from '@/common/screens/title/screen-title';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import { useGlobalSearchParams } from 'expo-router';
import WebView from 'react-native-webview';

export default function OrderAuthTokenScreen() {
  // params
  // params
  const { orderId, authToken } = useGlobalSearchParams<{ orderId: string; authToken: string }>();
  // tracking
  useTrackScreenView('Deeplink');
  // UI
  return (
    <>
      <ScreenTitle title="Rastreio de pedido" />
      <WebView
        originWhitelist={['*']}
        source={{ uri: getAppjustoURL(`/pedido/${orderId}/${authToken}`) }}
        containerStyle={{
          backgroundColor: colors.white,
          paddingHorizontal: paddings.lg,
          paddingBottom: 20,
        }}
        style={{}}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </>
  );
}
