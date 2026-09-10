import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SettingsProvider } from '../src/context/SettingsContext';
import { C } from '../src/theme';
import { initAds } from '../src/utils/ads';
import { hasOnboarded } from '../src/utils/onboarding';

// Keep the native splash up until we know whether to open the tutorial, so a first-time
// user never sees a flash of the home screen before the setup flow.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const router = useRouter();
  const [routed, setRouted] = useState(false);

  useEffect(() => {
    initAds();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (!(await hasOnboarded())) {
          router.replace('/tutorial?first=1');
        }
      } finally {
        setRouted(true);
      }
    })();
  }, [router]);

  useEffect(() => {
    if (routed) SplashScreen.hideAsync().catch(() => {});
  }, [routed]);

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
