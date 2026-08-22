import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { BackHeader } from '../../src/components/BackHeader';
import { getSentencesByLevel, JLPT_LEVELS } from '../../src/data/sentences';
import { getWordsByLevel } from '../../src/data/vocab';

type ContentType = 'mots' | 'phrases';

const TYPE_OPTIONS: { type: ContentType; label: string }[] = [
  { type: 'mots', label: 'Mots' },
  { type: 'phrases', label: 'Phrases' },
];

export default function LevelSelectScreen() {
  const router = useRouter();
  const [contentType, setContentType] = useState<ContentType>('mots');

  const countFor = (level: string) =>
    contentType === 'mots' ? getWordsByLevel(level).length : getSentencesByLevel(level).length;

  return (
    <View style={styles.container}>
      <BackHeader title="Par niveau JLPT" onBack={() => router.replace('/training')} />

      <View style={styles.typeSwitchWrap}>
        <View style={styles.typeSwitch}>
          {TYPE_OPTIONS.map((option) => {
            const active = option.type === contentType;
            return (
              <Pressable
                key={option.type}
                onPress={() => setContentType(option.type)}
                style={[styles.typeSegment, active && styles.typeSegmentActive]}
              >
                <Text style={[styles.typeLabel, active && styles.typeLabelActive]}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <FlatList
        data={JLPT_LEVELS}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => router.push({ pathname: '/game', params: { mode: 'training', level: item, contentType } })}
          >
            <View style={styles.cardText}>
              <Text style={styles.cardLabel}>{item}</Text>
              <Text style={styles.cardCount}>
                {countFor(item)} {contentType === 'mots' ? 'mots' : 'phrases'}
              </Text>
            </View>
            <Text style={styles.cardChevron}>›</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  typeSwitchWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },
  typeSwitch: {
    flexDirection: 'row',
    width: 200,
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 3,
  },
  typeSegment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 9,
  },
  typeSegmentActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  typeLabelActive: {
    color: '#1E293B',
  },
  list: {
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 18,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPressed: {
    backgroundColor: '#EFF6FF',
  },
  cardText: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  cardCount: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  cardChevron: {
    fontSize: 20,
    color: '#CBD5E1',
  },
});
