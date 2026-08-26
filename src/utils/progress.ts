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

const MILESTONES: { min: number; text: string }[] = [
  { min: 0, text: 'Chaque mot compte, continue comme ça !' },
  { min: 100, text: 'L’équivalent d’une page de cahier bien remplie.' },
  { min: 1000, text: 'Autant de mots qu’un article de blog costaud.' },
  { min: 5000, text: 'L’équivalent d’une longue nouvelle.' },
  { min: 15000, text: 'Autant qu’un rapport de fin d’année.' },
  { min: 30000, text: 'Tu approches la longueur d’un roman court.' },
  { min: 50000, text: '50 000 mots : le seuil officiel d’un roman (merci NaNoWriMo) !' },
  { min: 100000, text: 'Autant de mots qu’un roman bien épais.' },
  { min: 250000, text: 'L’équivalent de plusieurs romans mis bout à bout.' },
  { min: 500000, text: 'Tu as dépassé la trilogie du Seigneur des Anneaux en mots tapés !' },
];

/** Playful real-world comparison for the lifetime word count, shown on the home screen. */
export function getWordsMilestone(totalWords: number): string | null {
  let text: string | null = null;
  for (const milestone of MILESTONES) {
    if (totalWords >= milestone.min) text = milestone.text;
  }
  return text;
}

export interface ResumePoint {
  label: string;
  glyph: string;
  /** Category/theme emoji, shown instead of the kanji glyph when there is one. */
  emoji?: string | null;
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
