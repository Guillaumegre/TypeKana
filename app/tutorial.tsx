import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { BackHeader } from '../src/components/BackHeader';
import { C, FONT } from '../src/theme';

export default function TutorialScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <BackHeader title="Tutoriel" onBack={() => router.replace('/settings')} />
      <View style={styles.body}>
        <Text style={styles.glyph}>説</Text>
        <Text style={styles.title}>Bientôt</Text>
        <Text style={styles.text}>
          Contenu à venir : comment installer le clavier japonais sur ton téléphone, et comment fonctionne la
          saisie kana dans l’appli.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.paper,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  glyph: {
    fontFamily: FONT.mincho,
    fontSize: 64,
    color: 'rgba(20,22,26,.12)',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.8,
    color: C.ink,
    marginTop: 12,
  },
  text: {
    fontSize: 14.5,
    lineHeight: 21,
    fontWeight: '500',
    color: C.inkSoft,
    textAlign: 'center',
    marginTop: 10,
  },
});
