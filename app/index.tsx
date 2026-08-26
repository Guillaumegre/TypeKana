import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, FONT, R } from '../src/theme';
import { getStats, getResume, getWordsMilestone, type ResumePoint, type Stats } from '../src/utils/progress';
import { getRacePB, type RaceScore } from '../src/utils/raceStats';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [racePB, setRacePB] = useState<RaceScore | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [resume, setResume] = useState<ResumePoint | null>(null);

  useFocusEffect(
    useCallback(() => {
      getRacePB().then(setRacePB);
      getStats().then(setStats);
      getResume().then(setResume);
    }, []),
  );

  const milestone = stats && stats.totalWords > 0 ? getWordsMilestone(stats.totalWords) : null;

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <Pressable
            onPress={() => router.push('/settings')}
            hitSlop={10}
            style={({ pressed }) => [styles.settingsButton, pressed && styles.pressedSoft]}
          >
            {/* U+FE0E forces the flat text glyph instead of the detailed colour emoji. */}
            <Text style={styles.settingsGlyph}>{'⚙︎'}</Text>
          </Pressable>
        </View>

        <Text style={styles.eyebrow}>かな入力</Text>
        <Text style={styles.title}>TypeKana</Text>
        <Text style={styles.subtitle}>Apprendre le clavier japonais, un mot à la fois.</Text>

        {!!stats && stats.totalWords > 0 && (
          <Text style={styles.statsLine}>
            {stats.streak} jour{stats.streak > 1 ? 's' : ''} de suite · {stats.totalWords} mots tapés
          </Text>
        )}
        {!!milestone && <Text style={styles.milestoneLine}>{milestone}</Text>}

        <Pressable
          onPress={() => router.push('/training')}
          style={({ pressed }) => [
            styles.bigCard,
            styles.firstCard,
            styles.trainingCard,
            pressed && styles.pressedCard,
          ]}
        >
          <Text style={styles.cardWatermark}>練</Text>
          <View>
            <Text style={styles.cardEyebrow}>ENTRAÎNEMENT</Text>
            <Text style={styles.cardTitle}>Training</Text>
            <Text style={styles.cardSub}>Par thème ou par niveau JLPT</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => router.push({ pathname: '/game', params: { mode: 'race' } })}
          style={({ pressed }) => [styles.bigCard, styles.raceCard, pressed && styles.pressedCard]}
        >
          <Text style={[styles.cardWatermark, styles.cardWatermarkWarm]}>速</Text>
          <View>
            <Text style={[styles.cardEyebrow, styles.cardEyebrowWarm]}>60 SECONDES</Text>
            <Text style={styles.cardTitle}>Race</Text>
            <Text style={[styles.cardSub, styles.cardSubWarm]}>
              {racePB ? `Ton record : ${racePB.correct} mots` : 'Aucun record pour l’instant'}
            </Text>
          </View>
        </Pressable>
      </ScrollView>

      {resume && (
        <View style={[styles.resumeBar, { paddingBottom: insets.bottom + 14 }]}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/game',
                params: {
                  mode: 'training',
                  resume: '1',
                  ...(resume.category ? { category: resume.category } : {}),
                  ...(resume.level ? { level: resume.level } : {}),
                  ...(resume.contentType ? { contentType: resume.contentType } : {}),
                  ...(resume.listId ? { listId: resume.listId } : {}),
                },
              })
            }
            style={({ pressed }) => [styles.resumeCard, pressed && styles.pressedSoft]}
          >
            <View style={styles.resumeGlyphBox}>
              <Text style={resume.emoji ? styles.resumeEmoji : styles.resumeGlyph}>
                {resume.emoji || resume.glyph}
              </Text>
            </View>
            <View style={styles.resumeBody}>
              <Text style={styles.resumeLabel} numberOfLines={1}>
                Reprendre · {resume.label}
              </Text>
              <View style={styles.resumeTrack}>
                <View
                  style={[
                    styles.resumeFill,
                    { width: `${Math.round((resume.index / Math.max(resume.total, 1)) * 100)}%` },
                  ]}
                />
              </View>
            </View>
            <Text style={styles.resumeCount}>
              {resume.index}/{resume.total}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.paper,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 0,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  settingsButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsGlyph: {
    fontSize: 30,
    lineHeight: 36,
    color: C.ink,
  },
  pressedSoft: {
    opacity: 0.7,
  },
  pressedCard: {
    opacity: 0.9,
    transform: [{ scale: 0.995 }],
  },
  eyebrow: {
    fontFamily: FONT.mincho,
    fontSize: 15,
    letterSpacing: 4,
    color: C.accent,
    marginTop: 26,
  },
  title: {
    fontSize: 46,
    fontWeight: '900',
    letterSpacing: -1.6,
    color: C.ink,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14.5,
    fontWeight: '500',
    color: C.inkSoft,
    marginTop: 9,
  },
  statsLine: {
    fontSize: 12.5,
    fontWeight: '600',
    color: C.inkFaint,
    marginTop: 14,
  },
  milestoneLine: {
    fontSize: 12,
    fontWeight: '500',
    color: C.inkFaint,
    marginTop: 3,
  },
  firstCard: {
    marginTop: 26,
  },
  bigCard: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: R.xl,
    paddingVertical: 22,
    paddingHorizontal: 24,
    marginTop: 12,
  },
  trainingCard: {
    backgroundColor: C.ink,
  },
  raceCard: {
    backgroundColor: C.accent,
  },
  cardWatermark: {
    position: 'absolute',
    right: 4,
    bottom: -48,
    fontFamily: FONT.mincho,
    fontSize: 132,
    lineHeight: 140,
    color: C.watermark,
  },
  cardWatermarkWarm: {
    color: C.watermarkWarm,
  },
  cardEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: C.onDarkFaint,
  },
  cardEyebrowWarm: {
    color: 'rgba(255,255,255,.62)',
  },
  cardTitle: {
    fontSize: 29,
    fontWeight: '900',
    letterSpacing: -1,
    color: C.onDark,
    marginTop: 6,
  },
  cardSub: {
    fontSize: 13.5,
    fontWeight: '500',
    color: C.onDarkSoft,
    marginTop: 3,
  },
  cardSubWarm: {
    color: 'rgba(255,255,255,.72)',
  },
  resumeBar: {
    paddingHorizontal: 24,
    paddingTop: 10,
    backgroundColor: C.paper,
    borderTopWidth: 1,
    borderTopColor: C.line,
  },
  resumeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  resumeGlyphBox: {
    width: 38,
    height: 38,
    borderRadius: R.sm,
    backgroundColor: C.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumeGlyph: {
    fontFamily: FONT.mincho,
    fontSize: 18,
    color: C.onDark,
  },
  resumeEmoji: {
    fontSize: 19,
  },
  resumeBody: {
    flex: 1,
  },
  resumeLabel: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
    color: C.ink,
  },
  resumeTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: C.line,
    marginTop: 7,
    overflow: 'hidden',
  },
  resumeFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: C.accent,
  },
  resumeCount: {
    fontSize: 12,
    fontWeight: '700',
    color: C.inkFaint,
  },
});
