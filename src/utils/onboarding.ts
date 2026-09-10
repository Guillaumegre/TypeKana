import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Whether the user has been through the first-launch keyboard tutorial. Deliberately
 * kept out of resetProgress(): wiping stats shouldn't drag the user back through the
 * setup flow they've already done.
 */
const KEY = 'typekana:onboarded';

export async function hasOnboarded(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(KEY)) === '1';
  } catch {
    // If storage is unreadable, assume onboarded rather than trapping the user in the
    // tutorial on every launch.
    return true;
  }
}

export async function markOnboarded(): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, '1');
  } catch {
    // Best effort — worst case the tutorial shows once more next launch.
  }
}
