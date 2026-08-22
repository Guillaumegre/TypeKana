import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BackHeader } from '../src/components/BackHeader';

export default function ResultsScreen() {
  const router = useRouter();
  const { mode, correct, total, accuracy, isNewPB, pbCorrect } = useLocalSearchParams<{
    mode: string;
    correct: string;
    total: string;
    accuracy: string;
    isNewPB?: string;
    pbCorrect?: string;
  }>();

  const isRace = mode === 'race';

  return (
    <View style={styles.screen}>
      <BackHeader />
      <View style={styles.container}>
        <Text style={styles.title}>{isRace ? 'Race terminée !' : 'Entraînement terminé !'}</Text>

        {isRace && isNewPB === '1' && <Text style={styles.pbBanner}>🏆 Nouveau record !</Text>}
        {isRace && isNewPB === '0' && <Text style={styles.pbSubtitle}>Ton record : {pbCorrect} mots corrects</Text>}

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {correct}/{total}
            </Text>
            <Text style={styles.statLabel}>{isRace ? 'mots vus' : 'mots corrects'}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{accuracy}%</Text>
            <Text style={styles.statLabel}>précision</Text>
          </View>
        </View>

        <View style={styles.buttons}>
          <Pressable
            style={[styles.button, styles.primaryButton]}
            onPress={() =>
              isRace
                ? router.replace({ pathname: '/game', params: { mode: 'race' } })
                : router.replace('/training')
            }
          >
            <Text style={styles.buttonText}>Rejouer</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.secondaryButton]} onPress={() => router.replace('/')}>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Accueil</Text>
          </Pressable>
        </View>
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
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  pbBanner: {
    fontSize: 17,
    fontWeight: '700',
    color: '#D97706',
    marginTop: 12,
  },
  pbSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 32,
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
