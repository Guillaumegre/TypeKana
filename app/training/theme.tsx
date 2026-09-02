import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackHeader } from '../../src/components/BackHeader';
import { CATEGORIES, getWordsByCategory, RANDOM_CATEGORY_ID } from '../../src/data/vocab';
import { useSettings } from '../../src/context/SettingsContext';
import { useT } from '../../src/i18n';
import { C, FONT, R } from '../../src/theme';

const RANDOM = CATEGORIES.find((c) => c.id === RANDOM_CATEGORY_ID)!;
const THEMES = CATEGORIES.filter((c) => c.id !== RANDOM_CATEGORY_ID);

export default function ThemeSelectScreen() {
  const router = useRouter();
  const t = useT();
  const { sessionLength } = useSettings();
  const insets = useSafeAreaInsets();

  const open = (categoryId: string) =>
    router.push({ pathname: '/game', params: { mode: 'training', category: categoryId } });

  return (
    <View style={styles.screen}>
      <BackHeader title={t.theme.title} subtitle={t.theme.subtitle(sessionLength)} onBack={() => router.replace('/training')} />
      <FlatList
        data={THEMES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 26 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Pressable
            onPress={() => open(RANDOM.id)}
            style={({ pressed }) => [styles.randomCard, pressed && styles.pressedCard]}
          >
            <Text style={styles.randomWatermark}>{RANDOM.glyph}</Text>
            <View>
              <Text style={styles.randomEyebrow}>{t.theme.randomEyebrow}</Text>
              <Text style={styles.randomTitle}>{t.categories.aleatoire}</Text>
              <Text style={styles.randomSub}>{t.theme.randomSub}</Text>
            </View>
          </Pressable>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => open(item.id)}
            style={({ pressed }) => [styles.card, pressed && styles.pressedRow]}
          >
            <View style={styles.glyphBox}>
              <Text style={styles.glyph}>{item.emoji}</Text>
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardLabel}>{t.categories[item.labelKey as keyof typeof t.categories]}</Text>
              <Text style={styles.cardCount}>{t.theme.wordCount(getWordsByCategory(item.id).length)}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.paper,
  },
  list: {
    paddingHorizontal: 24,
    gap: 9,
  },
  pressedCard: {
    opacity: 0.9,
  },
  pressedRow: {
    borderColor: 'rgba(20,22,26,.3)',
  },
  randomCard: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: C.ink,
    borderRadius: R.lg,
    padding: 18,
    marginBottom: 9,
  },
  randomWatermark: {
    position: 'absolute',
    right: 14,
    bottom: -26,
    fontFamily: FONT.mincho,
    fontSize: 86,
    lineHeight: 92,
    color: C.watermark,
  },
  randomEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: C.onDarkFaint,
  },
  randomTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.7,
    color: C.onDark,
    marginTop: 4,
  },
  randomSub: {
    fontSize: 12.5,
    fontWeight: '500',
    color: C.onDarkSoft,
    marginTop: 2,
  },
  card: {
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
  cardText: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 16.5,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: C.ink,
  },
  cardCount: {
    fontSize: 11.5,
    fontWeight: '500',
    color: C.inkFaint,
    marginTop: 3,
  },
  chevron: {
    fontSize: 18,
    color: 'rgba(20,22,26,.25)',
  },
});
