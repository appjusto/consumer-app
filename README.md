# .env.dev.local

EXPO_PUBLIC_ENV=
EXPO_PUBLIC_EAS_PROJECT_ID=
EXPO_PUBLIC_GOOGLE_SERVICES_JSON=
EXPO_PUBLIC_GOOGLE_SERVICES_PLIST=
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=
EXPO_PUBLIC_ALGOLIA_APPID=
EXPO_PUBLIC_ALGOLIA_APIKEY=
EXPO_PUBLIC_BACKGROUND_GEOLOCATION_LICENSE=
EXPO_PUBLIC_BACKGROUND_GEOLOCATION_SECRET=

# deeplink

xcrun simctl openurl booted "exp+app-justo-consumer-dev://"
xcrun simctl openurl booted "https://dev.appjusto.com.br/"
adb shell am start -a android.intent.action.VIEW -d "exp+app-justo-consumer-dev://"
adb shell am start -a android.intent.action.VIEW -d "https://dev.appjusto.com.br/"