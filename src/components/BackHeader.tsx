import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme';

export function BackHeader({
  title,
  subtitle,
  onBack,
}: {
  title?: string;
  subtitle?: string;
  onBack: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.row, { paddingTop: insets.top + 14 }]}>
      <Pressable
        onPress={onBack}
        hitSlop={12}
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
      >
        <Text style={styles.backButtonText}>‹</Text>
      </Pressable>
      {(title || subtitle) && (
        <View style={styles.text}>
          {title && (
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          )}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingBottom: 14,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: 'rgba(20,22,26,.12)',
    backgroundColor: C.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  backButtonText: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '600',
    color: C.ink,
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.6,
    color: C.ink,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: C.inkFaint,
    marginTop: 1,
  },
});
