import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { BackHeader } from '../src/components/BackHeader';
import { useSettings } from '../src/context/SettingsContext';
import { useT } from '../src/i18n';
import type { Lang } from '../src/i18n/translations';
import { C, R } from '../src/theme';

const LANGUAGES: { lang: Lang; label: string }[] = [
  { lang: 'fr', label: 'Français' },
  { lang: 'en', label: 'English' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const t = useT();
  const { soundEnabled, setSoundEnabled, lang, setLang } = useSettings();

  return (
    <View style={styles.screen}>
      <BackHeader title={t.settings.title} onBack={() => router.replace('/')} />

      <View style={styles.content}>
        <Pressable
          onPress={() => router.push('/tutorial')}
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
        >
          <View style={styles.glyphBox}>
            <Text style={styles.glyph}>📖</Text>
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowLabel}>{t.settings.tutorial}</Text>
            <Text style={styles.rowSub}>{t.settings.tutorialSub}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        <View style={[styles.row, styles.rowSpaced]}>
          <View style={styles.glyphBox}>
            <Text style={styles.glyph}>🔊</Text>
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowLabel}>{t.settings.sound}</Text>
            <Text style={styles.rowSub}>{t.settings.soundSub}</Text>
          </View>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{ false: 'rgba(20,22,26,.16)', true: C.accent }}
            thumbColor="#FBF9F5"
          />
        </View>

        <View style={[styles.row, styles.rowSpaced]}>
          <View style={styles.glyphBox}>
            <Text style={styles.glyph}>🌍</Text>
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowLabel}>{t.settings.language}</Text>
            <Text style={styles.rowSub}>{t.settings.languageSub}</Text>
          </View>
          <View style={styles.langSwitch}>
            {LANGUAGES.map((option) => {
              const active = option.lang === lang;
              return (
                <Pressable
                  key={option.lang}
                  onPress={() => setLang(option.lang)}
                  style={[styles.langSegment, active && styles.langSegmentActive]}
                >
                  <Text style={[styles.langLabel, active && styles.langLabelActive]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Text style={styles.hint}>{t.settings.hint}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.paper,
  },
  content: {
    paddingHorizontal: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: 'rgba(20,22,26,.09)',
    borderRadius: R.lg,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  pressed: {
    borderColor: 'rgba(20,22,26,.3)',
  },
  rowSpaced: {
    marginTop: 10,
  },
  langSwitch: {
    flexDirection: 'row',
    backgroundColor: 'rgba(20,22,26,.07)',
    borderRadius: 10,
    padding: 3,
  },
  langSegment: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 7,
  },
  langSegmentActive: {
    backgroundColor: C.card,
  },
  langLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: C.inkFaint,
  },
  langLabelActive: {
    color: C.ink,
  },
  glyphBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(20,22,26,.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    fontSize: 22,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 16.5,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: C.ink,
  },
  rowSub: {
    fontSize: 11.5,
    fontWeight: '500',
    color: C.inkFaint,
    marginTop: 3,
  },
  chevron: {
    fontSize: 18,
    color: 'rgba(20,22,26,.25)',
  },
  hint: {
    fontSize: 12.5,
    lineHeight: 18,
    color: C.inkFaint,
    textAlign: 'center',
    marginTop: 18,
    paddingHorizontal: 8,
  },
});
