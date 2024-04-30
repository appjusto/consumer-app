import { Environment } from '@appjusto/types';
import { ConfigContext, ExpoConfig } from 'expo/config';
import { Extra } from './extra/types';
import { version, versionCode } from './version.json';

const env = process.env.EXPO_PUBLIC_ENV as Environment;
const projectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID;
const domain = `${env === 'live' ? '' : `${env}.`}appjusto.com.br`;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  owner: 'appjusto',
  privacy: 'hidden',
  name: name(),
  slug: slug(),
  version,
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: scheme(),
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'cover',
    backgroundColor: '#46d99b',
  },
  assetBundlePatterns: ['**/*'],
  notification: {
    icon: './assets/images/notification-icon.png',
  },
  ios: {
    bundleIdentifier: appBundlePackage(),
    buildNumber: `${versionCode}`,
    supportsTablet: false,
    googleServicesFile: process.env.EXPO_PUBLIC_GOOGLE_SERVICES_PLIST,
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
    },
    associatedDomains: [`applinks:${domain}`, 'appjusto.ngrok.io'],
  },
  android: {
    package: appBundlePackage(),
    versionCode,
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive_icon.png',
      backgroundColor: '#FFCA41',
    },
    googleServicesFile: process.env.EXPO_PUBLIC_GOOGLE_SERVICES_JSON,
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    },
    intentFilters: [
      {
        autoVerify: true,
        action: 'VIEW',
        data: [
          {
            scheme: 'https',
            host: domain,
            pathPrefix: '/r',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
      {
        autoVerify: true,
        action: 'VIEW',
        data: [
          {
            scheme: 'https',
            host: domain,
            pathPrefix: '/busca',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
      {
        autoVerify: true,
        action: 'VIEW',
        data: [
          {
            scheme: 'https',
            host: domain,
            pathPrefix: '/profile',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
  plugins: [
    'expo-router',
    'expo-localization',
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
    '@react-native-firebase/crashlytics',
    [
      'expo-image-picker',
      {
        photosPermission: 'Para o envio de selfie e documento',
        cameraPermission: 'Para o envio de selfie e documento',
      },
    ],
    [
      'expo-notifications',
      {
        icon: './assets/images/notification-icon.png',
        // sounds: ['./assets/sounds/order_request.wav'],
      },
    ],
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          'Utilizamos sua localização para exibir restaurantes próximos à você.',
      },
    ],
    [
      'expo-gradle-ext-vars',
      {
        googlePlayServicesLocationVersion: '20.0.0',
        appCompatVersion: '1.4.2',
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          enableProguardInReleaseBuilds: false,
        },
        ios: {
          useFrameworks: 'static',
        },
      },
    ],
    // './plugins/react-native-maps-plugin',
    // './plugins/withAndroidVerifiedLinksWorkaround',
  ],
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  updates: {
    url: `https://u.expo.dev/${projectId}`,
    fallbackToCacheTimeout: 1000 * 3,
  },
  runtimeVersion: {
    policy: 'sdkVersion',
  },
  extra: {
    env,
    firebase: {
      emulator: {
        host: process.env.EXPO_PUBLIC_FIREBASE_EMULATOR,
      },
      region: 'southamerica-east1',
    },
    algolia: {
      appId: process.env.EXPO_PUBLIC_ALGOLIA_APPID,
      apiKey: process.env.EXPO_PUBLIC_ALGOLIA_APIKEY,
    },
    iugu: {
      accountId: process.env.EXPO_PUBLIC_IUGU_ACCOUNT_ID,
    },
    eas: {
      projectId,
    },
    router: {
      origin: false,
    },
    location: {
      secret: process.env.EXPO_PUBLIC_BACKGROUND_GEOLOCATION_SECRET,
    },
  } as Extra,
});

const name = () => {
  const name = 'AppJusto';
  if (!env || env === 'live') return name;
  return `(${env.charAt(0).toUpperCase()}) ${name}`;
};

const slug = () => {
  const slug = `app-justo-consumer`;
  if (!env || env === 'live') return slug;
  return `${slug}-${env}`;
};

const scheme = () => {
  const scheme = 'appjustoconsumer';
  if (!env || env === 'live') return scheme;
  return `${scheme}${env}`;
};

const appBundlePackage = () => {
  return `br.com.appjusto.consumer.${env}`;
};
