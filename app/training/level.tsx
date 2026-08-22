import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { BackHeader } from '../../src/components/BackHeader';
import { getSentencesByLevel, JLPT_LEVELS } from '../../src/data/sentences';

export default function LevelSelectScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <BackHeader title="Par niveau JLPT" />
      <FlatList
        data={JLPT_LEVELS}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => router.push({ pathname: '/game', params: { mode: 'training', level: item } })}
          >
            <View style={styles.cardText}>
              <Text style={styles.cardLabel}>{item}</Text>
              <Text style={styles.cardCount}>{getSentencesByLevel(item).length} phrases</Text>
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
