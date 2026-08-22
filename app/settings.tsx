import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable style={styles.tutorialRow} onPress={() => router.push('/tutorial')}>
        <Text style={styles.tutorialLabel}>Revoir le tutoriel</Text>
        <Text style={styles.tutorialChevron}>›</Text>
      </Pressable>
      <Text style={styles.hint}>
        Le mode d'affichage (kana / kanji / indice / rappel) se règle directement depuis l'écran de jeu.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: 8,
  },
  tutorialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  tutorialLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  tutorialChevron: {
    fontSize: 20,
    color: '#94A3B8',
  },
  hint: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 32,
  },
});
