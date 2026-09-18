import { useFocusEffect } from 'expo-router';
import { useCallback, useState, useSyncExternalStore } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useT } from '../i18n';
import { C } from '../theme';
import { isPremiumUser, presentPremiumPaywall, subscribeToPremium } from '../utils/premium';
import { getQuota, type QuotaState } from '../utils/quota';

/**
 * "Sessions du jour  2/5" — and "2/∞" once premium. Free players can tap it to see the
 * plans: it sits exactly where the limit is felt, so it's the natural place to sell it.
 */
export function SessionCounter() {
  const t = useT();
  const isPremium = useSyncExternalStore(subscribeToPremium, isPremiumUser);
  const [quota, setQuota] = useState<QuotaState | null>(null);

  useFocusEffect(
    useCallback(() => {
      getQuota().then(setQuota);
    }, []),
  );

  if (!quota) return null;

  // A blocked attempt still bumps `used` past the allowance (see consumeSession), so clamp:
  // "7/5" would read as a bug rather than "you're out of sessions".
  const shown = isPremium ? quota.used : Math.min(quota.used, quota.allowed);
  const exhausted = !isPremium && shown >= quota.allowed;

  return (
    <Pressable
      disabled={isPremium}
      onPress={() => presentPremiumPaywall()}
      hitSlop={6}
      style={({ pressed }) => [styles.pill, pressed && styles.pressed]}
    >
      <Text style={styles.label}>{t.home.sessionsToday}</Text>
      <Text style={[styles.value, exhausted && styles.valueExhausted]}>
        {shown}/
        <Text style={isPremium ? styles.infinity : undefined}>{isPremium ? '∞' : quota.allowed}</Text>
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.line,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: C.inkSoft,
  },
  value: {
    fontSize: 13,
    fontWeight: '800',
    color: C.ink,
  },
  valueExhausted: {
    color: C.accent,
  },
  infinity: {
    fontSize: 17,
    lineHeight: 17,
  },
});
