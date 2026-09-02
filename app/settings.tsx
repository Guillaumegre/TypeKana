import { useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackHeader } from '../src/components/BackHeader';
import { SESSION_LENGTHS, useSettings } from '../src/context/SettingsContext';
import { useT } from '../src/i18n';
import type { Lang } from '../src/i18n/translations';
import { C, FONT, R } from '../src/theme';
import { isPremiumUser } from '../src/utils/premium';
import { resetProgress } from '../src/utils/resetProgress';

// Two languages only, so the design's two-line "region over code" chip would repeat
// itself (FR over FR). The name alone is clearer, and makes the current value obvious
// without a separate label beside the title.
const LANGUAGES: { lang: Lang; label: string }[] = [
  { lang: 'fr', label: 'Français' },
  { lang: 'en', label: 'English' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const t = useT();
  const insets = useSafeAreaInsets();
  const { soundEnabled, setSoundEnabled, lang, setLang, sessionLength, setSessionLength } =
    useSettings();

  const onReset = () => {
    Alert.alert(t.settings.resetTitle, t.settings.resetBody, [
      { text: t.settings.resetCancel, style: 'cancel' },
      { text: t.settings.resetConfirm, style: 'destructive', onPress: () => resetProgress() },
    ]);
  };

  return (
    <View style={styles.screen}>
      <BackHeader title={t.settings.title} subtitle={t.settings.titleJa} onBack={() => router.replace('/')} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 28 }]}
        showsVerticalScrollIndicator={false}
      >
        {!isPremiumUser() && (
          <View style={styles.premium}>
            <Text style={styles.premiumWatermark}>極</Text>
            <Text style={styles.premiumEyebrow}>{t.settings.premiumEyebrow}</Text>
            <Text style={styles.premiumTitle}>{t.settings.premiumTitle}</Text>
            <Text style={styles.premiumSub}>{t.settings.premiumSub}</Text>
          </View>
        )}

        <Section title={t.settings.sectionPractice}>
          <View style={styles.rowHeader}>
            <Text style={styles.rowLabel}>{t.settings.wordsPerSession}</Text>
            <Text style={styles.rowValue}>{sessionLength}</Text>
          </View>
          <View style={styles.chips}>
            {SESSION_LENGTHS.map((value) => {
              const active = value === sessionLength;
              return (
                <Pressable
                  key={value}
                  onPress={() => setSessionLength(value)}
                  style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && styles.pressed]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{value}</Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section title={t.settings.sectionApp}>
          <Text style={styles.rowLabel}>{t.settings.language}</Text>
          <View style={styles.chips}>
            {LANGUAGES.map((option) => {
              const active = option.lang === lang;
              return (
                <Pressable
                  key={option.lang}
                  onPress={() => setLang(option.lang)}
                  style={({ pressed }) => [styles.langChip, active && styles.chipActive, pressed && styles.pressed]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.divider} />

          <Pressable
            onPress={() => router.push('/tutorial')}
            style={({ pressed }) => [styles.row, pressed && styles.pressedRow]}
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

          <View style={styles.divider} />

          <View style={styles.row}>
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
        </Section>

        <Text style={styles.hint}>{t.settings.hint}</Text>

        <Pressable onPress={onReset} style={({ pressed }) => [styles.reset, pressed && styles.pressed]}>
          <Text style={styles.resetText}>{t.settings.reset}</Text>
        </Pressable>
      </ScrollView>
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
  premium: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: C.accent,
    borderRadius: R.lg,
    paddingVertical: 18,
    paddingHorizontal: 18,
  },
  premiumWatermark: {
    position: 'absolute',
    right: 12,
    bottom: -26,
    fontFamily: FONT.mincho,
    fontSize: 92,
    lineHeight: 98,
    color: C.watermarkWarm,
  },
  premiumEyebrow: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: 'rgba(255,255,255,.62)',
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.5,
    color: '#FBF9F5',
    marginTop: 5,
  },
  premiumSub: {
    fontSize: 12.5,
    fontWeight: '500',
    color: 'rgba(255,255,255,.75)',
    marginTop: 3,
  },
  section: {
    marginTop: 22,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: C.inkFaint,
    marginBottom: 8,
    marginLeft: 2,
  },
  card: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: 'rgba(20,22,26,.09)',
    borderRadius: R.lg,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowValue: {
    fontSize: 16,
    fontWeight: '800',
    color: C.accent,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: R.sm,
    borderWidth: 1,
    borderColor: 'rgba(20,22,26,.12)',
    backgroundColor: C.paper,
  },
  langChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: R.sm,
    borderWidth: 1,
    borderColor: 'rgba(20,22,26,.12)',
    backgroundColor: C.paper,
  },
  chipActive: {
    backgroundColor: C.ink,
    borderColor: C.ink,
  },
  chipText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: C.inkSoft,
  },
  chipTextActive: {
    color: C.onDark,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(20,22,26,.08)',
    marginVertical: 14,
    marginHorizontal: -16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  pressedRow: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.85,
  },
  glyphBox: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: 'rgba(20,22,26,.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    fontSize: 20,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 15.5,
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
    marginTop: 20,
    paddingHorizontal: 8,
  },
  reset: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 6,
  },
  resetText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: C.accent,
  },
});
