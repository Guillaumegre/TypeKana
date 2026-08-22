import { StyleSheet, Text, View } from 'react-native';

export default function TutorialScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📖</Text>
      <Text style={styles.title}>Tutoriel</Text>
      <Text style={styles.subtitle}>
        Contenu à venir : comment installer le clavier japonais sur ton téléphone, et comment fonctionne la saisie
        kana dans l'appli.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#F8FAFC',
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
