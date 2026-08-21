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
            <Text style={styles.cardLabel}>{item.label}</Text>
            <Text style={styles.cardCount}>{getWordsByCategory(item.id).length} mots</Text>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardPressed: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
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
});
