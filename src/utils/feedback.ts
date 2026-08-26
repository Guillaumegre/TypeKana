import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// expo-haptics has no meaningful effect on web (no Taptic Engine / inconsistent
// Vibration API support), so skip it there instead of letting calls silently fail.
const supported = Platform.OS !== 'web';

export function tapHaptic(): void {
  if (!supported) return;
  Haptics.selectionAsync().catch(() => {});
}

export function successHaptic(): void {
  if (!supported) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

export function errorHaptic(): void {
  if (!supported) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
}
