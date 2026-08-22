import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { BackHeader } from '../src/components/BackHeader';

export default function TutorialScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <BackHeader title="Tutoriel" onBack={() => router.replace('/settings')} />
      <View style={styles.container}>
        <Text style={styles.emoji}>📖</Text>
        <Text style={styles.title}>Tutoriel</Text>
        <Text style={styles.subtitle}>
          Contenu à venir : comment installer le clavier japonais sur ton téléphone, et comment fonctionne la saisie
          kana dans l'appli.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },
});
