import { defaultConfig } from '@tamagui/config/v4';
import { TamaguiProvider, createTamagui } from '@tamagui/core';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFrameworkReady } from '../src/hooks/useFrameworkReady';
import { initDatabase } from '../src/utils/initDatabase';

const tursoSyncUrl = process.env.EXPO_PUBLIC_TURSO_SYNC_URL || '';
const tursoAuthToken = process.env.EXPO_PUBLIC_TURSO_AUTH_TOKEN || '';

const config = createTamagui(defaultConfig);

type Conf = typeof config;

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

export default function RootLayout() {
  useFrameworkReady();
  const insets = useSafeAreaInsets();

  return (
    <SQLiteProvider
      databaseName="asistencia.db"
      options={{
        libSQLOptions: {
          url: tursoSyncUrl,
          authToken: tursoAuthToken,
        },
      }}
      onInit={initDatabase}
    >
      <TamaguiProvider config={config} defaultTheme="dark">
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: '#000',
              paddingTop: insets.top,
            },
          }}
        />
      </TamaguiProvider>
    </SQLiteProvider>
  );
}
