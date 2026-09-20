import { useRouter } from 'expo-router';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { Alert, AppState, Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackHeader } from '../src/components/BackHeader';
import { SESSION_LENGTHS, useSettings } from '../src/context/SettingsContext';
import { useT } from '../src/i18n';
import type { Lang } from '../src/i18n/translations';
import { C, FONT, R } from '../src/theme';
import { privacyOptionsRequired, showAdsPrivacyOptions, subscribeToConsent } from '../src/utils/ads';
import {
  isPremiumUser,
  presentPremiumPaywall,
  restorePurchases,
  subscribeToPremium,
} from '../src/utils/premium';
import { hasReminderPermission, requestReminderPermission } from '../src/utils/reminder';
import { resetProgress } from '../src/utils/resetProgress';

// Served from GitHub Pages (docs/privacy-policy.html). Google Play requires the policy
// to be reachable from inside the app, not only from the store listing.
const PRIVACY_URL = 'https://guillaumegre.github.io/TypeKana/privacy-policy.html';

// Two languages only, so the design's two-line "region over code" chip would repeat
// itself (FR over FR). The name alone is clearer, and makes the current value obvious
// without a separate label beside the title.
const LANGUAGES: { lang: Lang; label: string }[] = [
  { lang: 'fr', label: 'Français' },
  { lang: 'en', label: 'English' },
];

const pad = (n: number) => String(n).padStart(2, '0');

/** How far the − / + buttons move the reminder time. */
const REMINDER_STEP_MINUTES = 15;

/** One-tap times for the usual moments of the day, so most people never touch − / +. */
const REMINDER_PRESETS = [
  { hour: 8, minute: 0, emoji: '🌅' },
  { hour: 12, minute: 30, emoji: '🍱' },
  { hour: 19, minute: 0, emoji: '🌆' },
  { hour: 22, minute: 0, emoji: '🌙' },
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
  const {
    soundEnabled,
    setSoundEnabled,
    lang,
    setLang,
    sessionLength,
    setSessionLength,
    reminderEnabled,
    reminderHour,
    reminderMinute,
    setReminderEnabled,
    setReminderTime,
  } = useSettings();
  // The reminder is on in the settings but the system has since withdrawn the notification
  // permission — the switch alone wouldn't tell the user why nothing arrives.
  const [reminderBlocked, setReminderBlocked] = useState(false);
  // Only true once consent has resolved and the user is somewhere GDPR requires the
  // ongoing ability to revisit their ad consent choice (EEA/UK) — hidden everywhere else.
  const showAdsPrivacyRow = useSyncExternalStore(subscribeToConsent, privacyOptionsRequired);
  const isPremium = useSyncExternalStore(subscribeToPremium, isPremiumUser);

  useEffect(() => {
    if (!reminderEnabled) {
      setReminderBlocked(false);
      return;
    }
    let cancelled = false;
    const check = () =>
      hasReminderPermission().then((granted) => {
        if (!cancelled) setReminderBlocked(!granted);
      });
    check();
    // Coming back from the system settings after granting (or revoking) the permission.
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') check();
    });
    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, [reminderEnabled]);

  const openSystemSettings = () => Linking.openSettings().catch(() => {});

  // The permission is only asked when the user turns the reminder on, so the system prompt
  // appears in a context where its purpose is obvious.
  const onToggleReminder = async (value: boolean) => {
    if (!value) {
      setReminderEnabled(false);
      return;
    }
    if (await requestReminderPermission(t.reminder.channel)) {
      setReminderEnabled(true);
      return;
    }
    Alert.alert(t.settings.reminderDeniedTitle, t.settings.reminderDeniedBody, [
      { text: t.settings.reminderCancel, style: 'cancel' },
      { text: t.settings.reminderOpenSettings, onPress: openSystemSettings },
    ]);
  };

  // Steps through the whole day, wrapping at midnight (23:45 + 15 min → 00:00).
  const stepReminder = (dir: 1 | -1) => {
    const total = (reminderHour * 60 + reminderMinute + dir * REMINDER_STEP_MINUTES + 1440) % 1440;
    setReminderTime(Math.floor(total / 60), total % 60);
  };

  const onReset = () => {
    Alert.alert(t.settings.resetTitle, t.settings.resetBody, [
      { text: t.settings.resetCancel, style: 'cancel' },
      { text: t.settings.resetConfirm, style: 'destructive', onPress: () => resetProgress() },
    ]);
  };

  const onPressPremium = async () => {
    const outcome = await presentPremiumPaywall();
    if (outcome === 'unavailable') {
      Alert.alert(t.settings.premiumUnavailableTitle, t.settings.premiumUnavailableBody);
    }
  };

  const onRestore = async () => {
    const restored = await restorePurchases();
    Alert.alert(
      restored ? t.settings.restoreFoundTitle : t.settings.restoreNoneTitle,
      restored ? t.settings.restoreFoundBody : t.settings.restoreNoneBody,
    );
  };

  return (
    <View style={styles.screen}>
      <BackHeader title={t.settings.title} subtitle={t.settings.titleJa} onBack={() => router.replace('/')} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 28 }]}
        showsVerticalScrollIndicator={false}
      >
        {isPremium ? (
          <View style={styles.premium}>
            <Text style={styles.premiumWatermark}>極</Text>
            <Text style={styles.premiumEyebrow}>{t.settings.premiumEyebrow}</Text>
            <Text style={styles.premiumTitle}>{t.settings.premiumActiveTitle}</Text>
            <Text style={styles.premiumSub}>{t.settings.premiumActiveSub}</Text>
          </View>
        ) : (
          <Pressable
            onPress={onPressPremium}
            style={({ pressed }) => [styles.premium, pressed && styles.pressed]}
          >
            <Text style={styles.premiumWatermark}>極</Text>
            <Text style={styles.premiumEyebrow}>{t.settings.premiumEyebrow}</Text>
            <Text style={styles.premiumTitle}>{t.settings.premiumTitle}</Text>
            <Text style={styles.premiumSub}>{t.settings.premiumSub}</Text>
          </Pressable>
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

        <Section title={t.settings.sectionReminder}>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>{t.settings.reminder}</Text>
              <Text style={styles.rowSub}>{t.settings.reminderSub}</Text>
            </View>
            <Switch
              value={reminderEnabled}
              onValueChange={onToggleReminder}
              trackColor={{ false: 'rgba(20,22,26,.16)', true: C.accent }}
              thumbColor="#FBF9F5"
            />
          </View>

          {reminderEnabled && (
            <>
              {reminderBlocked && (
                <Pressable onPress={openSystemSettings} style={({ pressed }) => pressed && styles.pressed}>
                  <Text style={styles.blockedHint}>{t.settings.reminderBlocked}</Text>
                </Pressable>
              )}

              <View style={styles.divider} />

              <View style={styles.rowHeader}>
                <Text style={styles.rowLabel}>{t.settings.reminderTime}</Text>
                <View style={styles.timePill}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${t.settings.reminderTime} −`}
                    onPress={() => stepReminder(-1)}
                    style={({ pressed }) => [styles.timePillBtn, pressed && styles.pressed]}
                  >
                    <Text style={styles.timePillBtnText}>−</Text>
                  </Pressable>
                  <Text style={styles.timePillValue}>
                    {pad(reminderHour)}:{pad(reminderMinute)}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${t.settings.reminderTime} +`}
                    onPress={() => stepReminder(1)}
                    style={({ pressed }) => [styles.timePillBtn, pressed && styles.pressed]}
                  >
                    <Text style={styles.timePillBtnText}>+</Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.presets}>
                {REMINDER_PRESETS.map((preset) => {
                  const active = preset.hour === reminderHour && preset.minute === reminderMinute;
                  return (
                    <Pressable
                      key={`${preset.hour}:${preset.minute}`}
                      onPress={() => setReminderTime(preset.hour, preset.minute)}
                      style={({ pressed }) => [styles.preset, active && styles.chipActive, pressed && styles.pressed]}
                    >
                      <Text style={styles.presetEmoji}>{preset.emoji}</Text>
                      <Text style={[styles.presetTime, active && styles.chipTextActive]}>
                        {pad(preset.hour)}:{pad(preset.minute)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}
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

          {showAdsPrivacyRow && (
            <>
              <View style={styles.divider} />
              <Pressable
                onPress={() => showAdsPrivacyOptions()}
                style={({ pressed }) => [styles.row, pressed && styles.pressedRow]}
              >
                <View style={styles.glyphBox}>
                  <Text style={styles.glyph}>🔒</Text>
                </View>
                <View style={styles.rowText}>
                  <Text style={styles.rowLabel}>{t.settings.adsPrivacy}</Text>
                  <Text style={styles.rowSub}>{t.settings.adsPrivacySub}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            </>
          )}

          <View style={styles.divider} />

          <Pressable
            onPress={() => Linking.openURL(PRIVACY_URL).catch(() => {})}
            style={({ pressed }) => [styles.row, pressed && styles.pressedRow]}
          >
            <View style={styles.glyphBox}>
              <Text style={styles.glyph}>📄</Text>
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>{t.settings.privacyPolicy}</Text>
              <Text style={styles.rowSub}>{t.settings.privacyPolicySub}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>

          {!isPremium && (
            <>
              <View style={styles.divider} />
              <Pressable
                onPress={onRestore}
                style={({ pressed }) => [styles.row, pressed && styles.pressedRow]}
              >
                <View style={styles.glyphBox}>
                  <Text style={styles.glyph}>↺</Text>
                </View>
                <View style={styles.rowText}>
                  <Text style={styles.rowLabel}>{t.settings.restore}</Text>
                  <Text style={styles.rowSub}>{t.settings.restoreSub}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            </>
          )}
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
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20,22,26,.06)',
    borderRadius: R.sm,
  },
  timePillBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timePillBtnText: {
    fontSize: 20,
    fontWeight: '600',
    color: C.inkFaint,
  },
  timePillValue: {
    minWidth: 58,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
    color: C.accent,
  },
  presets: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  preset: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
    borderRadius: R.sm,
    borderWidth: 1,
    borderColor: 'rgba(20,22,26,.12)',
    backgroundColor: C.paper,
  },
  presetEmoji: {
    fontSize: 20,
  },
  presetTime: {
    fontSize: 12,
    fontWeight: '700',
    color: C.inkSoft,
  },
  blockedHint: {
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '600',
    color: C.accent,
    marginTop: 10,
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
