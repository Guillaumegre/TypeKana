import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { useT } from '../i18n';
import { C } from '../theme';

type Mode = 'kana' | 'kanji' | 'indice' | 'rappel';

export function ModeSwitch({ allowBlind = true }: { allowBlind?: boolean }) {
  const { kanjiMode, hintMode, blindMode, setKanjiMode, setHintMode, setBlindMode } = useSettings();
  const t = useT();
  const OPTIONS: { mode: Mode; label: string }[] = [
    { mode: 'kana', label: t.modes.kana },
    { mode: 'kanji', label: t.modes.kanji },
    { mode: 'indice', label: t.modes.hint },
    { mode: 'rappel', label: t.modes.recall },
  ];
  const current: Mode = blindMode ? 'rappel' : !kanjiMode ? 'kana' : hintMode ? 'indice' : 'kanji';
  const options = allowBlind ? OPTIONS : OPTIONS.filter((o) => o.mode !== 'rappel');

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
      {options.map((option) => {
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
    width: '100%',
    backgroundColor: 'rgba(20,22,26,.07)',
    borderRadius: 11,
    padding: 3,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 8,
  },
  segmentActive: {
    backgroundColor: C.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: C.inkFaint,
  },
  labelActive: {
    color: C.ink,
  },
});
