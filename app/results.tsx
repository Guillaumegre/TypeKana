import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { AdBanner } from '../src/components/AdBanner';
import { useT } from '../src/i18n';
import { C, FONT, R } from '../src/theme';
import { shouldShowInterstitial } from '../src/utils/adCadence';
import { showInterstitialAd } from '../src/utils/ads';
import { isPremiumUser } from '../src/utils/premium';

export default function ResultsScreen() {
  const router = useRouter();
  const t = useT();
  const insets = useSafeAreaInsets();
  const { mode, correct, total, isNewPB, pbCorrect, category, level, contentType, listId } =
    useLocalSearchParams<{
      mode: string;
      correct: string;
      total: string;
      isNewPB?: string;
      pbCorrect?: string;
      category?: string;
      level?: string;
      contentType?: string;
      listId?: string;
    }>();

  const isRace = mode === 'race';

  const [leaving, setLeaving] = useState(false);

  const goTo = (navigate: () => void) => async () => {
    if (leaving) return;
    setLeaving(true);
    // Shown on the way out rather than on arrival: replacing the score the player just
    // earned with a full-screen ad is far more irritating than filling a transition they
    // already chose. Never for premium.
    if (!isPremiumUser() && (await shouldShowInterstitial())) {
      await showInterstitialAd();
    }
    navigate();
  };

  const replay = goTo(() =>
    isRace
      ? router.replace({ pathname: '/game', params: { mode: 'race' } })
      : router.replace({
          pathname: '/game',
          params: {
            mode: 'training',
            ...(category ? { category } : {}),
            ...(level ? { level } : {}),
            ...(contentType ? { contentType } : {}),
            ...(listId ? { listId } : {}),
          },
        }),
  );

  const goHome = goTo(() => router.replace('/'));

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <StatusBar style="light" />
      <View style={styles.body}>
        <Text style={styles.eyebrow}>けっか</Text>

        <Text style={styles.score}>{isRace ? correct : `${correct}/${total}`}</Text>

        <Text style={styles.scoreLabel}>{isRace ? t.results.wordsIn60 : t.results.correctWords}</Text>

        {isRace && isNewPB === '1' && <Text style={styles.verdict}>{t.results.newRecord}</Text>}
        {isRace && isNewPB === '0' && <Text style={styles.verdictMuted}>{t.results.recordToBeat(Number(pbCorrect))}</Text>}
      </View>

      <View style={styles.buttons}>
        <Pressable onPress={replay} style={({ pressed }) => [styles.primary, pressed && styles.pressed]}>
          <Text style={styles.primaryText}>{t.results.replay}</Text>
        </Pressable>
        <Pressable
          onPress={goHome}
          style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
        >
          <Text style={styles.secondaryText}>{t.results.home}</Text>
        </Pressable>
      </View>

      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.ink,
    paddingHorizontal: 34,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    fontFamily: FONT.mincho,
    fontSize: 14,
    letterSpacing: 5,
    color: 'rgba(242,239,232,.5)',
  },
  score: {
    fontSize: 92,
    fontWeight: '900',
    letterSpacing: -5,
    lineHeight: 100,
    color: C.onDark,
    marginTop: 8,
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: 'rgba(242,239,232,.55)',
  },
  verdict: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E8A08C',
    marginTop: 18,
  },
  verdictMuted: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(242,239,232,.5)',
    marginTop: 18,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
  },
  primary: {
    flex: 1,
    backgroundColor: C.accent,
    borderRadius: R.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryText: {
    color: '#FBF9F5',
    fontSize: 15.5,
    fontWeight: '900',
  },
  secondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(242,239,232,.25)',
    borderRadius: R.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryText: {
    color: C.onDark,
    fontSize: 15.5,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
});
