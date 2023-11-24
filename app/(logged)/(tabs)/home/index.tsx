import { useTrackScreenView } from '@/api/analytics/useTrackScreenView';
import { useContextCurrentPlace } from '@/api/preferences/context/PreferencesContext';
import { DefaultScrollView } from '@/common/components/containers/DefaultScrollView';
import { DefaultView } from '@/common/components/containers/DefaultView';
import colors from '@/common/styles/colors';
import paddings from '@/common/styles/paddings';
import screens from '@/common/styles/screens';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function HomeScreen() {
  // context
  const currentPlace = useContextCurrentPlace();
  // state
  // tracking
  useTrackScreenView('Início');
  // side effects
  useEffect(() => {
    if (currentPlace === null) {
      router.push('/places/new');
    } else if (currentPlace && !currentPlace.location) {
      router.push('/places/confirm');
    }
  }, [currentPlace]);
  console.log('currentPlace', currentPlace);
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
