import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BackHeader } from '../../src/components/BackHeader';

export default function TrainingModeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <BackHeader title="Training" />
      <View style={styles.content}>
        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => router.push('/training/theme')}
        >
          <Text style={styles.cardEmoji}>🗂️</Text>
          <Text style={styles.cardLabel}>Par thème</Text>
          <Text style={styles.cardDescription}>Animaux, transports, nourriture, couleurs...</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => router.push('/training/level')}
        >
          <Text style={styles.cardEmoji}>🎓</Text>
          <Text style={styles.cardLabel}>Par niveau JLPT</Text>
          <Text style={styles.cardDescription}>Phrases courantes classées N5 à N1</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 20,
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
    fontSize: 28,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  cardDescription: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
});
