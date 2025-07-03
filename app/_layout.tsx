import { defaultConfig } from '@tamagui/config/v4';
import { Stack } from 'expo-router';
import { createTamagui, TamaguiProvider } from 'tamagui';

const config = createTamagui(defaultConfig);
type Conf = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default function RootLayout() {
  return (
    <TamaguiProvider config={config}>
      <Stack />
    </TamaguiProvider>
  );
}
