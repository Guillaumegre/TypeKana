import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BackHeader } from '../src/components/BackHeader';

export default function RaceComingSoonScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <BackHeader title="Race" />
      <View style={styles.container}>
        <Text style={styles.emoji}>🏁</Text>
        <Text style={styles.title}>Mode Race</Text>
        <Text style={styles.subtitle}>Bientôt disponible : 60 secondes chrono, mots aléatoires, PB sauvegardé.</Text>
        <Pressable style={styles.button} onPress={() => router.replace('/training')}>
          <Text style={styles.buttonText}>Aller au Training</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
