import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function LoggedLayout() {
  // UI
  return (
    <Stack
      screenOptions={({ route }) => {
        // console.log(route);
        return { headerShown: route.name !== 'index', headerBackTitleVisible: false };
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false, title: '' }} />
      <Stack.Screen name="places/index" options={{ title: 'Seus endereços' }} />
      <Stack.Screen name="places/new" options={{ title: 'Novo endereço' }} />
      <Stack.Screen name="places/confirm" options={{ title: 'Confirmar endereço' }} />
      <Stack.Screen name="places/number" options={{ title: 'Número' }} />
      <Stack.Screen name="places/complement" options={{ title: 'Complemento' }} />
      <Stack.Screen name="checkout/[orderId]/index" options={{ title: 'Sua sacola' }} />
      <Stack.Screen
        name="checkout/[orderId]/fleets/[fleetId]"
        options={{ title: 'Detalhe da frota' }}
      />
      <Stack.Screen
        name="checkout/[orderId]/fleets/search"
        options={{ title: 'Frotas disponíveis' }}
      />
    </Stack>
  );
}
