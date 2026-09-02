import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Everything that counts as "progress": streak and typed words, the Race record, an
 * interrupted session, and today's session allowance.
 *
 * Deliberately excluded: 'typekana:custom_lists' (words the user wrote themselves, which
 * are content rather than progress) and 'typekana:settings' (language, sound, session
 * length). Wiping either would surprise someone who only wanted to start their stats over.
 */
const PROGRESS_KEYS = [
  'typekana:stats',
  'typekana:race_pb',
  'typekana:resume',
  'typekana:quota',
];

export async function resetProgress(): Promise<void> {
  await AsyncStorage.multiRemove(PROGRESS_KEYS);
}
