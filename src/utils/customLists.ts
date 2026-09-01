import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GameEntry } from '../types/vocab';

const KEY = 'typekana:custom_lists';

export interface CustomWord {
  id: string;
  /** What the player must type. */
  kana: string;
  /** Optional kanji form, used by the Kanji/Indice modes when present. */
  kanji: string | null;
  /** Free-text label the user typed, in whatever language they chose — never translated. */
  meaning: string;
}

/** Lists written before the app was localized stored this field as `meaning_fr`. */
type StoredCustomWord = CustomWord & { meaning_fr?: string };

function normalizeWord(word: StoredCustomWord): CustomWord {
  return {
    id: word.id,
    kana: word.kana,
    kanji: word.kanji ?? null,
    meaning: word.meaning ?? word.meaning_fr ?? '',
  };
}

export interface CustomList {
  id: string;
  name: string;
  words: CustomWord[];
}

function makeId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export async function getLists(): Promise<CustomList[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Migrate on read so lists created before localization keep their meanings.
    return parsed.map((l: CustomList & { words: StoredCustomWord[] }) => ({
      ...l,
      words: (l.words ?? []).map(normalizeWord),
    }));
  } catch {
    return [];
  }
}

export async function getList(id: string): Promise<CustomList | null> {
  const lists = await getLists();
  return lists.find((l) => l.id === id) ?? null;
}

async function writeLists(lists: CustomList[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(lists));
}

export async function createList(name: string): Promise<CustomList> {
  const lists = await getLists();
  const list: CustomList = { id: makeId('list'), name, words: [] };
  await writeLists([...lists, list]);
  return list;
}

export async function renameList(id: string, name: string): Promise<void> {
  const lists = await getLists();
  await writeLists(lists.map((l) => (l.id === id ? { ...l, name } : l)));
}

export async function deleteList(id: string): Promise<void> {
  const lists = await getLists();
  await writeLists(lists.filter((l) => l.id !== id));
}

export async function addWord(
  listId: string,
  word: Omit<CustomWord, 'id'>,
): Promise<void> {
  const lists = await getLists();
  await writeLists(
    lists.map((l) =>
      l.id === listId ? { ...l, words: [...l.words, { ...word, id: makeId('cw') }] } : l,
    ),
  );
}

export async function removeWord(listId: string, wordId: string): Promise<void> {
  const lists = await getLists();
  await writeLists(
    lists.map((l) => (l.id === listId ? { ...l, words: l.words.filter((w) => w.id !== wordId) } : l)),
  );
}

/** Adapts stored words to what the game screen renders. */
export function toGameEntries(list: CustomList): GameEntry[] {
  return list.words.map((w) => ({
    id: w.id,
    kana: w.kana,
    kanji: w.kanji,
    // The user's own text, so it reads the same whichever interface language is active.
    meaning: { fr: w.meaning, en: w.meaning },
    emoji: null,
    color: null,
  }));
}
