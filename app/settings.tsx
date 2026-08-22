import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useSettings } from '../src/context/SettingsContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { kanjiMode, hintMode, setKanjiMode, setHintMode } = useSettings();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={styles.rowLabel}>Mode Kanji</Text>
          <Text style={styles.rowDescription}>
            Affiche le kanji quand le mot en a un. La saisie attendue reste toujours la lecture en kana.
          </Text>
        </View>
        <Switch value={kanjiMode} onValueChange={setKanjiMode} />
      </View>

      {kanjiMode && (
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowLabel}>Indice</Text>
            <Text style={styles.rowDescription}>Affiche la lecture en kana au-dessus du kanji, pour t'aider.</Text>
          </View>
          <Switch value={hintMode} onValueChange={setHintMode} />
        </View>
      )}

      <Pressable style={styles.tutorialRow} onPress={() => router.push('/tutorial')}>
        <Text style={styles.tutorialLabel}>Revoir le tutoriel</Text>
        <Text style={styles.tutorialChevron}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 16,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  rowDescription: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 18,
  },
  tutorialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginTop: 24,
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
});
