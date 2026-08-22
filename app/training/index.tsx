import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { CATEGORIES, getWordsByCategory } from '../../src/data/vocab';

export default function TrainingSelectScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Choisis un thème</Text>
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => router.push({ pathname: '/game', params: { mode: 'training', category: item.id } })}
          >
            <Text style={styles.cardEmoji}>{item.emoji}</Text>
            <View style={styles.cardText}>
              <Text style={styles.cardLabel}>{item.label}</Text>
              <Text style={styles.cardCount}>{getWordsByCategory(item.id).length} mots</Text>
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  list: {
    gap: 12,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 18,
    gap: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPressed: {
    backgroundColor: '#EFF6FF',
  },
  cardEmoji: {
    fontSize: 30,
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
