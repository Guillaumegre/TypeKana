import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'typekana:race_pb';

export interface RaceScore {
  correct: number;
  accuracy: number;
}

export async function getRacePB(): Promise<RaceScore | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function saveRacePBIfBetter(score: RaceScore): Promise<{ isNewPB: boolean; pb: RaceScore }> {
  const current = await getRacePB();
  if (!current || score.correct > current.correct) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(score));
    return { isNewPB: true, pb: score };
  }
  return { isNewPB: false, pb: current };
}
