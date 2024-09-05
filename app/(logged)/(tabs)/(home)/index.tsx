import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextCurrentPlace } from '@/api/preferences/context/PreferencesContext';
import { DefaultView } from '@/common/components/containers/DefaultView';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';

export default function HomeScreen() {
  // params
  const params = useLocalSearchParams<{ orderId: string }>();
  const orderId = params.orderId;
  // context
  const currentPlace = useContextCurrentPlace();
  // side effects
  // tracking
  useTrackScreenView('Início');
  // side effects
  useEffect(() => {
    if (currentPlace === undefined) return;
    if (currentPlace === null) {
      // router.push('/places/new');
    }
  }, [currentPlace]);
  useEffect(() => {
    if (orderId) {
      router.replace({
        pathname: '/(logged)/(tabs)/order/',
        params: { orderId },
      });
      router.setParams({ orderId: '' });
    }
  }, [orderId]);
  // logs
  // console.log('currentPlace', currentPlace);
  // UI
  return (
    <View style={{ ...screens.default }}>
      <DefaultView style={screens.headless}>
        {/* <AdreessBar />
        <SearchList style={{ marginLeft: paddings.lg }} mode="home" /> */}
        <WebView
          originWhitelist={['*']}
          source={{ uri: 'https://app-justo-staging.firebaseapp.com/' }}
          containerStyle={{
            backgroundColor: colors.white,
            paddingHorizontal: paddings.lg,
            paddingBottom: 20,
          }}
          style={{}}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </DefaultView>
    </View>
  );
}
