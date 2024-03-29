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
      <Stack.Screen name="index" options={{ title: 'Pedidos' }} />
      {/* <Stack.Screen
        name="checkout/confirming"
        options={{ presentation: 'modal', headerShown: false }}
      /> */}
    </Stack>
  );
}
