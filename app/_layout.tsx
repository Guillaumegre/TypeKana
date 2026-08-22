import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SettingsProvider } from '../src/context/SettingsContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#1E293B' },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: '#F8FAFC' },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'TypeKana' }} />
          <Stack.Screen name="training/index" options={{ title: 'Training' }} />
          <Stack.Screen name="race" options={{ title: 'Race' }} />
          <Stack.Screen name="game" options={{ headerShown: false }} />
          <Stack.Screen name="results" options={{ title: 'Résultats' }} />
          <Stack.Screen name="settings" options={{ title: 'Paramètres' }} />
          <Stack.Screen name="tutorial" options={{ title: 'Tutoriel' }} />
        </Stack>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
