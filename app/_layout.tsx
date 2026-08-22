import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
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
        <Stack.Screen name="game" options={{ title: 'TypeKana' }} />
        <Stack.Screen name="results" options={{ title: 'Résultats' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
