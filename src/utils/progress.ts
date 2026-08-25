import AsyncStorage from '@react-native-async-storage/async-storage';

const STATS_KEY = 'typekana:stats';
const RESUME_KEY = 'typekana:resume';

export interface Stats {
  /** Total words answered correctly, all sessions. */
  totalWords: number;
  /** Consecutive days with at least one session. */
  streak: number;
  /** ISO date (YYYY-MM-DD) of the last session, used to extend or reset the streak. */
  lastDay: string | null;
}

const EMPTY_STATS: Stats = { totalWords: 0, streak: 0, lastDay: null };

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(from: string, to: string): number {
  const ms = Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`);
  return Math.round(ms / 86400000);
}

export async function getStats(): Promise<Stats> {
  const raw = await AsyncStorage.getItem(STATS_KEY);
  return raw ? { ...EMPTY_STATS, ...JSON.parse(raw) } : EMPTY_STATS;
}

/** Call once a session ends: adds the words and extends (or resets) the day streak. */
export async function recordSession(wordsCorrect: number): Promise<Stats> {
  const current = await getStats();
  const day = today();

  let streak = current.streak;
  if (current.lastDay === day) {
    // already counted today
  } else if (current.lastDay && daysBetween(current.lastDay, day) === 1) {
    streak += 1;
  } else {
    streak = 1;
  }

  const next: Stats = {
    totalWords: current.totalWords + Math.max(0, wordsCorrect),
    streak,
    lastDay: day,
  };
  await AsyncStorage.setItem(STATS_KEY, JSON.stringify(next));
  return next;
}

export interface ResumePoint {
  label: string;
  glyph: string;
  index: number;
  total: number;
  /** Exact word/sentence ids of the interrupted session, so it resumes where it stopped. */
  ids: string[];
  category?: string;
  level?: string;
  contentType?: string;
  listId?: string;
}

export async function getResume(): Promise<ResumePoint | null> {
  const raw = await AsyncStorage.getItem(RESUME_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function saveResume(point: ResumePoint): Promise<void> {
  await AsyncStorage.setItem(RESUME_KEY, JSON.stringify(point));
}

export async function clearResume(): Promise<void> {
  await AsyncStorage.removeItem(RESUME_KEY);
}
