import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { isPlaceValid } from '@/api/consumer/places/isPlaceValid';
import { useContextCurrentPlace } from '@/api/preferences/context/PreferencesContext';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import { useInitialState } from '@/common/react/useInitialState';
import colors from '@/common/styles/colors';
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
    console.log(currentPlace);
    if (!currentPlace || !isPlaceValid(currentPlace)) {
      router.push('/places/new');
    }
  }, [currentPlace]);
  // handlers
  // UI
  return (
    <View style={{ ...screens.default }}>
      <DefaultView style={screens.headless}>
        <DefaultScrollView>
          <View style={{ padding: paddings.lg }}></View>
          <View
            style={{
              flex: 1,
              paddingVertical: paddings.sm,
              paddingHorizontal: paddings.lg,
              backgroundColor: colors.neutral50,
            }}
          ></View>
        </DefaultScrollView>
      </DefaultView>
    </View>
  );
}
