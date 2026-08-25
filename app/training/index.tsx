import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BackHeader } from '../../src/components/BackHeader';
import { C, FONT, R } from '../../src/theme';

export default function TrainingModeScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <BackHeader title="Training" onBack={() => router.replace('/')} />
      <View style={styles.content}>
        <Pressable
          onPress={() => router.push('/training/theme')}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        >
          <Text style={styles.watermark}>類</Text>
          <View>
            <Text style={styles.eyebrow}>VOCABULAIRE</Text>
            <Text style={styles.title}>Par thème</Text>
            <Text style={styles.sub}>Animaux, nourriture, verbes, couleurs...</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => router.push('/training/level')}
          style={({ pressed }) => [styles.card, styles.cardAlt, pressed && styles.pressed]}
        >
          <Text style={[styles.watermark, styles.watermarkWarm]}>級</Text>
          <View>
            <Text style={[styles.eyebrow, styles.eyebrowWarm]}>NIVEAU</Text>
            <Text style={styles.title}>JLPT</Text>
            <Text style={[styles.sub, styles.subWarm]}>Mots ou phrases, classés N5 à N1</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => router.push('/training/custom')}
          style={({ pressed }) => [styles.customCard, pressed && styles.pressedSoft]}
        >
          <Text style={styles.customGlyph}>✎</Text>
          <View style={styles.customText}>
            <Text style={styles.customTitle}>Mes listes</Text>
            <Text style={styles.customSub}>Tes propres mots à réviser</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
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
    gap: 12,
  },
  card: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: C.ink,
    borderRadius: R.xl,
    paddingVertical: 24,
    paddingHorizontal: 22,
  },
  cardAlt: {
    backgroundColor: C.accent,
  },
  pressed: {
    opacity: 0.9,
  },
  watermark: {
    position: 'absolute',
    right: 10,
    bottom: -30,
    fontFamily: FONT.mincho,
    fontSize: 110,
    lineHeight: 118,
    color: C.watermark,
  },
  watermarkWarm: {
    color: C.watermarkWarm,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: C.onDarkFaint,
  },
  eyebrowWarm: {
    color: 'rgba(255,255,255,.62)',
  },
  title: {
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: -0.9,
    color: C.onDark,
    marginTop: 6,
  },
  sub: {
    fontSize: 13,
    fontWeight: '500',
    color: C.onDarkSoft,
    marginTop: 3,
  },
  subWarm: {
    color: 'rgba(255,255,255,.72)',
  },
  customCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: 'rgba(20,22,26,.09)',
    borderRadius: R.lg,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  pressedSoft: {
    borderColor: 'rgba(20,22,26,.3)',
  },
  customGlyph: {
    fontSize: 20,
    color: C.inkSoft,
  },
  customText: {
    flex: 1,
  },
  customTitle: {
    fontSize: 16.5,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: C.ink,
  },
  customSub: {
    fontSize: 12.5,
    fontWeight: '500',
    color: C.inkFaint,
    marginTop: 2,
  },
  chevron: {
    fontSize: 18,
    color: 'rgba(20,22,26,.25)',
  },
});
