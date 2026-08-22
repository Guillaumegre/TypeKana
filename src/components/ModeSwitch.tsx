import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSettings } from '../context/SettingsContext';

type Mode = 'kana' | 'kanji' | 'indice' | 'rappel';

const OPTIONS: { mode: Mode; label: string }[] = [
  { mode: 'kana', label: 'Kana' },
  { mode: 'kanji', label: 'Kanji' },
  { mode: 'indice', label: 'Indice' },
  { mode: 'rappel', label: 'Rappel' },
];

export function ModeSwitch() {
  const { kanjiMode, hintMode, blindMode, setKanjiMode, setHintMode, setBlindMode } = useSettings();
  const current: Mode = blindMode ? 'rappel' : !kanjiMode ? 'kana' : hintMode ? 'indice' : 'kanji';

  const selectMode = (mode: Mode) => {
    if (mode === 'kana') {
      setKanjiMode(false);
    } else if (mode === 'kanji') {
      setKanjiMode(true);
      setHintMode(false);
    } else if (mode === 'indice') {
      setKanjiMode(true);
      setHintMode(true);
    } else {
      setBlindMode(true);
    }
  };

  return (
    <View style={styles.track}>
      {OPTIONS.map((option) => {
        const active = option.mode === current;
        return (
          <Pressable
            key={option.mode}
            onPress={() => selectMode(option.mode)}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 3,
  },
  segment: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 9,
  },
  segmentActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  labelActive: {
    color: '#1E293B',
  },
});
