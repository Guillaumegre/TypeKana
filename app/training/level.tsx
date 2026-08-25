import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackHeader } from '../../src/components/BackHeader';
import { getSentencesByLevel, JLPT_LEVELS } from '../../src/data/sentences';
import { getWordsByLevel } from '../../src/data/vocab';
import { C, FONT, R } from '../../src/theme';

type ContentType = 'mots' | 'phrases';

const TYPE_OPTIONS: { type: ContentType; label: string }[] = [
  { type: 'mots', label: 'Mots' },
  { type: 'phrases', label: 'Phrases' },
];

export default function LevelSelectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [contentType, setContentType] = useState<ContentType>('mots');

  const countFor = (level: string) =>
    contentType === 'mots' ? getWordsByLevel(level).length : getSentencesByLevel(level).length;

  return (
    <View style={styles.screen}>
      <BackHeader title="Par niveau JLPT" onBack={() => router.replace('/training')} />

      <View style={styles.switchWrap}>
        <View style={styles.switch}>
          {TYPE_OPTIONS.map((option) => {
            const active = option.type === contentType;
            return (
              <Pressable
                key={option.type}
                onPress={() => setContentType(option.type)}
                style={[styles.segment, active && styles.segmentActive]}
              >
                <Text style={[styles.segmentLabel, active && styles.segmentLabelActive]}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <FlatList
        data={JLPT_LEVELS}
        keyExtractor={(item) => item}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 26 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const count = countFor(item);
          const empty = count === 0;
          return (
            <Pressable
              disabled={empty}
              onPress={() =>
                router.push({ pathname: '/game', params: { mode: 'training', level: item, contentType } })
              }
              style={({ pressed }) => [styles.card, empty && styles.cardEmpty, pressed && styles.pressed]}
            >
              <View style={styles.levelBox}>
                <Text style={styles.levelText}>{item}</Text>
              </View>
              <View style={styles.cardText}>
                <Text style={[styles.cardLabel, empty && styles.textMuted]}>
                  {contentType === 'mots' ? 'Vocabulaire' : 'Phrases courantes'}
                </Text>
                <Text style={styles.cardCount}>
                  {empty ? 'Bientôt disponible' : `${count} ${contentType === 'mots' ? 'mots' : 'phrases'}`}
                </Text>
              </View>
              {!empty && <Text style={styles.chevron}>›</Text>}
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.paper,
  },
  switchWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },
  switch: {
    flexDirection: 'row',
    width: 210,
    backgroundColor: 'rgba(20,22,26,.07)',
    borderRadius: 11,
    padding: 3,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  segmentActive: {
    backgroundColor: C.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  segmentLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: C.inkFaint,
  },
  segmentLabelActive: {
    color: C.ink,
  },
  list: {
    paddingHorizontal: 24,
    gap: 9,
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
  cardEmpty: {
    opacity: 0.5,
  },
  pressed: {
    borderColor: 'rgba(20,22,26,.3)',
  },
  levelBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: C.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: {
    fontFamily: FONT.gothic,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.3,
    color: C.onDark,
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
  textMuted: {
    color: C.inkSoft,
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
