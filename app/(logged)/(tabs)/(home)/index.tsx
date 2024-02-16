import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextCurrentPlace } from '@/api/preferences/context/PreferencesContext';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { AdreessBar } from '@/common/screens/home/address-bar/address-bar';
import { BannerList } from '@/common/screens/home/banners/banner-list';
import { BusinessList } from '@/common/screens/home/businesses/list/business-list';
import { CuisineList } from '@/common/screens/home/cuisine/cuisine-list';
import { HomeOngoingOrders } from '@/common/screens/home/ongoing-orders/home-ongoing-orders';
import { useCreatePlace } from '@/common/screens/orders/checkout/places/useCreatePlace';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function HomeScreen() {
  // params
  const params = useLocalSearchParams<{ orderId: string }>();
  const orderId = params.orderId;
  // context
  const currentPlace = useContextCurrentPlace();
  // side effects
  useCreatePlace();
  // tracking
  useTrackScreenView('Início');
  // side effects
  useEffect(() => {
    if (currentPlace === undefined) return;
    if (currentPlace === null) {
      router.push('/places/new');
    }
  }, [currentPlace]);
  useEffect(() => {
    if (orderId) {
      router.replace({
        pathname: '/(logged)/(tabs)/(orders)/',
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
        <AdreessBar />
        <DefaultScrollView>
          <CuisineList style={{ marginVertical: paddings.xl, marginLeft: paddings.lg }} />
          <BannerList style={{ marginBottom: paddings.lg, marginLeft: paddings.lg }} />
          <HomeOngoingOrders />
          <BusinessList />
        </DefaultScrollView>
      </DefaultView>
    </View>
  );
}
