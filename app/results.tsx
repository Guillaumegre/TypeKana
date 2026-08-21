import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ResultsScreen() {
  const router = useRouter();
  const { correct, total, accuracy } = useLocalSearchParams<{
    correct: string;
    total: string;
    accuracy: string;
  }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entraînement terminé !</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {correct}/{total}
          </Text>
          <Text style={styles.statLabel}>mots corrects</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{accuracy}%</Text>
          <Text style={styles.statLabel}>précision</Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <Pressable style={[styles.button, styles.primaryButton]} onPress={() => router.replace('/training')}>
          <Text style={styles.buttonText}>Rejouer</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.secondaryButton]} onPress={() => router.replace('/')}>
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Accueil</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 32,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 48,
  },
  statBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2563EB',
  },
  statLabel: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
  },
  buttons: {
    width: '100%',
    gap: 12,
  },
  button: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2563EB',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButtonText: {
    color: '#1E293B',
  },
});
