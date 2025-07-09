import { defaultConfig } from '@tamagui/config/v4';
import { TamaguiProvider, createTamagui } from '@tamagui/core';
import { PortalProvider } from '@tamagui/portal';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const config = createTamagui(defaultConfig);

type Conf = typeof config;

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

export default function RootLayout() {
  const insets = useSafeAreaInsets();

  return (
    <TamaguiProvider config={config} defaultTheme="dark">
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'grey' }}>
        <PortalProvider>
          <KeyboardProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  backgroundColor: '#000',
                  paddingTop: insets.top,
                },
              }}
            />
          </KeyboardProvider>
        </PortalProvider>
      </GestureHandlerRootView>
    </TamaguiProvider>
  );
}
