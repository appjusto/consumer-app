import { ApiProvider } from '@/api/ApiContext';
import { AnalyticsProvider } from '@/api/analytics/context/AnalyticsContext';
import { BusinessProvider } from '@/api/business/context/business-context';
import { OrderProvider } from '@/api/orders/context/order-context';
import { PaymentsProvider } from '@/api/orders/payment/context/payments-context';
import { PlatformProvider } from '@/api/platform/context/platform-context';
import { PreferencesProvider } from '@/api/preferences/context/PreferencesContext';
import { AuthProvider } from '@/common/auth/AuthContext';
import { useSplashScreen } from '@/common/components/splashscreen/useSplashScreen';
import { Loading } from '@/common/components/views/Loading';
import { ToastProvider } from '@/common/components/views/toast/ToastContext';
import '@/common/errors/ignore';
import { NotificationProvider } from '@/common/notifications/context/NotificationContext';
import { setupNotifications } from '@/common/notifications/setup';
import { RoutesProvider } from '@/common/routes/RoutesContext';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '/',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
// setup notification channels
setupNotifications().then(null).catch(console.error);

export default function RootLayout() {
  // state
  const [loaded, error] = useFonts({
    HankenGroteskRegular: require('../assets/fonts/HankenGrotesk-Regular.ttf'),
    HankenGroteskMedium: require('../assets/fonts/HankenGrotesk-Medium.ttf'),
    HankenGroteskSemiBold: require('../assets/fonts/HankenGrotesk-SemiBold.ttf'),
    HankenGroteskBold: require('../assets/fonts/HankenGrotesk-Bold.ttf'),
  });
  const colorScheme = useColorScheme();
  const splashScreenShown = useSplashScreen();
  // const [inAppSuppressed, setInAppSuppressed] = useState(false);
  // side effects
  // error handling
  useEffect(() => {
    if (error) throw error;
  }, [error]);
  // splash
  useEffect(() => {
    if (loaded && !splashScreenShown) {
      SplashScreen.hideAsync();
    }
  }, [loaded, splashScreenShown]);
  // config
  useEffect(() => {
    // version toast
    // if (!isLive()) {
    // ShowToast(getAppVersion());
    // }
    // in-app messaging config
    // inAppMessaging()
    //   .setMessagesDisplaySuppressed(true)
    //   .then(() => setInAppSuppressed(true));
  }, []);
  // UI
  if (!loaded || splashScreenShown) {
    // if (!loaded || splashScreenShown || !inAppSuppressed) {
    return <Loading />;
  }
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ActionSheetProvider>
        <ToastProvider>
          <ApiProvider>
            <AuthProvider>
              <PlatformProvider>
                <NotificationProvider>
                  <RoutesProvider>
                    <AnalyticsProvider>
                      <PreferencesProvider>
                        <BusinessProvider>
                          <PaymentsProvider>
                            <OrderProvider>
                              <Slot />
                            </OrderProvider>
                          </PaymentsProvider>
                        </BusinessProvider>
                      </PreferencesProvider>
                    </AnalyticsProvider>
                  </RoutesProvider>
                </NotificationProvider>
              </PlatformProvider>
            </AuthProvider>
          </ApiProvider>
        </ToastProvider>
      </ActionSheetProvider>
    </ThemeProvider>
  );
}
