import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TypeKana</Text>
      <Text style={styles.subtitle}>Entraîne-toi à taper en kana</Text>

      <View style={styles.buttons}>
        <Pressable
          style={({ pressed }) => [styles.button, styles.trainingButton, pressed && styles.buttonPressed]}
          onPress={() => router.push('/training')}
        >
          <Text style={styles.buttonText}>Training</Text>
          <Text style={styles.buttonSubtext}>Par thème, à ton rythme</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.button, styles.raceButton, pressed && styles.buttonPressed]}
          onPress={() => router.push('/race')}
        >
          <Text style={styles.buttonText}>Race</Text>
          <Text style={styles.buttonSubtext}>60 secondes chrono</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 8,
    marginBottom: 48,
  },
  buttons: {
    width: '100%',
    gap: 16,
  },
  button: {
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  trainingButton: {
    backgroundColor: '#2563EB',
  },
  raceButton: {
    backgroundColor: '#DC2626',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  buttonSubtext: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    marginTop: 4,
  },
});
