import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '/',
};

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={({ route }) => {
        // console.log(route);
        return { headerShown: route.name !== 'index' };
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Restaurantes' }} />
      <Stack.Screen
        name="r/[businessId]/about"
        options={{ headerShown: false, presentation: 'modal' }}
      />
    </Stack>
  );
}
