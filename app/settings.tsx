import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { BackHeader } from '../src/components/BackHeader';
import { useSettings } from '../src/context/SettingsContext';
import { C, R } from '../src/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const { soundEnabled, setSoundEnabled } = useSettings();

  return (
    <View style={styles.screen}>
      <BackHeader title="Paramètres" onBack={() => router.replace('/')} />

      <View style={styles.content}>
        <Pressable
          onPress={() => router.push('/tutorial')}
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
        >
          <View style={styles.glyphBox}>
            <Text style={styles.glyph}>📖</Text>
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowLabel}>Revoir le tutoriel</Text>
            <Text style={styles.rowSub}>Installer et utiliser le clavier japonais</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        <View style={[styles.row, styles.rowSpaced]}>
          <View style={styles.glyphBox}>
            <Text style={styles.glyph}>🔊</Text>
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowLabel}>Son et vibrations</Text>
            <Text style={styles.rowSub}>Retour sonore et haptique en tapant</Text>
          </View>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{ false: 'rgba(20,22,26,.16)', true: C.accent }}
            thumbColor="#FBF9F5"
          />
        </View>

        <Text style={styles.hint}>
          Le mode d’affichage (kana / kanji / indice / rappel) se règle directement depuis l’écran de jeu.
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
  content: {
    paddingHorizontal: 24,
  },
  row: {
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
  pressed: {
    borderColor: 'rgba(20,22,26,.3)',
  },
  rowSpaced: {
    marginTop: 10,
  },
  glyphBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(20,22,26,.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    fontSize: 22,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 16.5,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: C.ink,
  },
  rowSub: {
    fontSize: 11.5,
    fontWeight: '500',
    color: C.inkFaint,
    marginTop: 3,
  },
  chevron: {
    fontSize: 18,
    color: 'rgba(20,22,26,.25)',
  },
  hint: {
    fontSize: 12.5,
    lineHeight: 18,
    color: C.inkFaint,
    textAlign: 'center',
    marginTop: 18,
    paddingHorizontal: 8,
  },
});
