import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { isPlaceValid } from '@/api/consumer/places/isPlaceValid';
import { useContextCurrentPlace } from '@/api/preferences/context/PreferencesContext';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { useInitialState } from '@/common/react/useInitialState';
import { AdreessBar } from '@/common/screens/home/address-bar/address-bar';
import { BannerList } from '@/common/screens/home/banners/banner-list';
import { BusinessList } from '@/common/screens/home/businesses/business-list';
import { CuisineList } from '@/common/screens/home/cuisine/cuisine-list';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function HomeScreen() {
  // context
  const currentPlace = useInitialState(useContextCurrentPlace());
  // state
  // tracking
  useTrackScreenView('Início');
  // side effects
  useEffect(() => {
    if (!currentPlace || !isPlaceValid(currentPlace)) {
      router.push('/places/new');
    }
  }, [currentPlace]);
  // handlers
  // UI
  return (
    <View style={{ ...screens.default }}>
      <DefaultView style={screens.headless}>
        <AdreessBar />
        <DefaultScrollView>
          <CuisineList style={{ marginVertical: paddings.xl, marginLeft: paddings.lg }} />
          <BannerList style={{ marginBottom: paddings.lg, marginLeft: paddings.lg }} />
          <BusinessList renderItem={undefined} data={undefined} />
        </DefaultScrollView>
      </DefaultView>
    </View>
  );
}
