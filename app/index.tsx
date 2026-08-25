import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, FONT, R } from '../src/theme';
import { getStats, getResume, type ResumePoint, type Stats } from '../src/utils/progress';
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

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <Pressable
            onPress={() => router.push('/settings')}
            hitSlop={10}
            style={({ pressed }) => [styles.settingsButton, pressed && styles.pressedSoft]}
          >
            <Text style={styles.settingsGlyph}>設</Text>
          </Pressable>
        </View>

        <Text style={styles.eyebrow}>かな入力</Text>
        <Text style={styles.title}>TypeKana</Text>
        <Text style={styles.subtitle}>Apprendre le clavier japonais, un mot à la fois.</Text>

        <View style={styles.statsGrid}>
          <Stat value={stats ? String(stats.streak) : '0'} label="JOURS" />
          <Stat value={stats ? String(stats.totalWords) : '0'} label="MOTS" />
          <Stat value={racePB ? String(racePB.correct) : '—'} label="MOTS/MIN" last />
        </View>

        <Pressable
          onPress={() => router.push('/training')}
          style={({ pressed }) => [styles.bigCard, styles.trainingCard, pressed && styles.pressedCard]}
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

        {resume && (
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
                },
              })
            }
            style={({ pressed }) => [styles.resumeCard, pressed && styles.pressedSoft]}
          >
            <View style={styles.resumeGlyphBox}>
              <Text style={styles.resumeGlyph}>{resume.glyph}</Text>
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
        )}
      </ScrollView>
    </View>
  );
}

function Stat({ value, label, last }: { value: string; label: string; last?: boolean }) {
  return (
    <View style={[styles.statBox, !last && styles.statDivider]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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
    gap: 0,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: R.sm,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsGlyph: {
    fontFamily: FONT.mincho,
    fontSize: 15,
    color: C.inkSoft,
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
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.line,
    overflow: 'hidden',
    marginTop: 24,
  },
  statBox: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  statDivider: {
    borderRightWidth: 1,
    borderRightColor: C.line,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.7,
    color: C.ink,
  },
  statLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: C.inkFaint,
    marginTop: 2,
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
    marginTop: 14,
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
