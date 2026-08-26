import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SettingsProvider } from '../src/context/SettingsContext';
import { C } from '../src/theme';
import { initAds } from '../src/utils/ads';

export default function RootLayout() {
  useEffect(() => {
    initAds();
  }, []);

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 140,
            contentStyle: { backgroundColor: C.paper },
          }}
        />
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
