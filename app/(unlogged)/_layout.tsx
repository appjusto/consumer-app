import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '/',
};

export default function UnloggedLayout() {
  // UI
  return (
    <Stack>
      <Stack.Screen
        name="phone-verification"
        options={{ presentation: 'modal', title: 'Verificação' }}
      />
    </Stack>
  );
}
