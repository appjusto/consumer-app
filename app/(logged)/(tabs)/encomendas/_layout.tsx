import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function OrdersLayout() {
  return (
    <Stack
      screenOptions={({ route }) => {
        return { headerShown: route.name !== 'index' };
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Entregas' }} />
      <Stack.Screen
        name="places/index"
        options={{ title: 'Local de coleta', presentation: 'modal' }}
      />
    </Stack>
  );
}
