import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { palette } from '@/theme/tokens';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.background }, animation: 'fade_from_bottom' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="levels" />
        <Stack.Screen name="game/[id]" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
