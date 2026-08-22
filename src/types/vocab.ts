export type JlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export interface VocabWord {
  id: string;
  kana: string;
  kanji: string | null;
  meaning_fr: string;
  category: string;
  jlpt_level: JlptLevel;
  emoji: string | null;
  color: string | null;
}

export interface Category {
  id: string;
  label: string;
  emoji: string;
}

export interface JlptSentence {
  id: string;
  kana: string;
  kanji: string | null;
  meaning_fr: string;
  jlpt_level: JlptLevel;
}

/** What the game screen needs to render a round, regardless of whether it came from a vocab word or a phrase. */
export interface GameEntry {
  kana: string;
  kanji: string | null;
  meaning_fr: string;
  emoji: string | null;
  color: string | null;
}
