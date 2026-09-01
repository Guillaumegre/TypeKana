import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BackHeader } from '../../src/components/BackHeader';
import { useT } from '../../src/i18n';
import { C, FONT, R } from '../../src/theme';
import { getLists } from '../../src/utils/customLists';

export default function TrainingModeScreen() {
  const router = useRouter();
  const t = useT();
  const [listCount, setListCount] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      getLists().then((lists) => setListCount(lists.length));
    }, []),
  );

  return (
    <View style={styles.screen}>
      <BackHeader title={t.training.title} onBack={() => router.replace('/')} />
      <View style={styles.content}>
        <Pressable
          onPress={() => router.push('/training/theme')}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        >
          <Text style={styles.watermark}>類</Text>
          <View>
            <Text style={styles.eyebrow}>{t.training.themeEyebrow}</Text>
            <Text style={styles.title}>{t.training.themeTitle}</Text>
            <Text style={styles.sub}>{t.training.themeSub}</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => router.push('/training/level')}
          style={({ pressed }) => [styles.card, styles.cardAlt, pressed && styles.pressed]}
        >
          <Text style={[styles.watermark, styles.watermarkWarm]}>級</Text>
          <View>
            <Text style={[styles.eyebrow, styles.eyebrowWarm]}>{t.training.levelEyebrow}</Text>
            <Text style={styles.title}>{t.training.levelTitle}</Text>
            <Text style={[styles.sub, styles.subWarm]}>{t.training.levelSub}</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => router.push('/training/custom')}
          style={({ pressed }) => [styles.card, styles.cardLight, pressed && styles.pressed]}
        >
          <Text style={[styles.watermark, styles.watermarkInk]}>札</Text>
          <View>
            <Text style={[styles.eyebrow, styles.eyebrowInk]}>
              {listCount === null ? ' ' : t.training.listsEyebrow(listCount)}
            </Text>
            <Text style={[styles.title, styles.titleInk]}>{t.training.listsTitle}</Text>
            <Text style={[styles.sub, styles.subInk]}>{t.training.listsSub}</Text>
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
    backgroundColor: C.accent,
  },
  cardLight: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.line,
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
  watermarkInk: {
    color: C.watermarkInk,
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
  eyebrowInk: {
    color: C.inkFaint,
  },
  title: {
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: -0.9,
    color: C.onDark,
    marginTop: 6,
  },
  titleInk: {
    color: C.ink,
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
  subInk: {
    color: C.inkSoft,
  },
});
