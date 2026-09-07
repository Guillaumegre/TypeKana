import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'typekana:ad_cadence';

/**
 * Sessions between two full-screen ads. One after every session would be intolerable for a
 * practice app people open several times a day; every third keeps it to roughly one or two
 * a day at the free allowance of five sessions.
 */
const INTERSTITIAL_EVERY = 3;

/**
 * Counts a finished session and says whether this is the one that earns a full-screen ad.
 *
 * Any storage problem answers "no": a counter we can't read is never a reason to show an
 * extra ad to someone.
 */
export async function shouldShowInterstitial(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const count = (Number(raw) || 0) + 1;
    if (count >= INTERSTITIAL_EVERY) {
      await AsyncStorage.setItem(KEY, '0');
      return true;
    }
    await AsyncStorage.setItem(KEY, String(count));
    return false;
  } catch {
    return false;
  }
}
