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
          <Text style={styles.watermark}>級</Text>
          <View>
            <Text style={styles.eyebrow}>NIVEAU</Text>
            <Text style={styles.title}>JLPT</Text>
            <Text style={styles.sub}>Mots ou phrases, classés N5 à N1</Text>
          </View>
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
    backgroundColor: '#2A2E36',
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
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: C.onDarkFaint,
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
});
