import type { Lang } from '../i18n/translations';

export type JlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

/** A meaning carried in every supported language, picked with the active Lang. */
export type LocalizedText = Record<Lang, string>;

export interface VocabWord {
  id: string;
  kana: string;
  kanji: string | null;
  meaning: LocalizedText;
  category: string;
  jlpt_level: JlptLevel;
  emoji: string | null;
  color: string | null;
}

export interface Category {
  id: string;
  /** Key into translations.categories — the label itself is localized. */
  labelKey: string;
  emoji: string;
  /** Single kanji used as the theme's mark on cards. */
  glyph: string;
}

/** One chunk of a furigana-annotated sentence: a kanji chunk carries its own reading, a kana chunk has none. */
export interface FuriganaSegment {
  text: string;
  reading?: string;
}

export interface JlptSentence {
  id: string;
  kana: string;
  kanji: string | null;
  furigana?: FuriganaSegment[];
  meaning: LocalizedText;
  jlpt_level: JlptLevel;
}

/** What the game screen needs to render a round, regardless of whether it came from a vocab word or a phrase. */
export interface GameEntry {
  id: string;
  kana: string;
  kanji: string | null;
  furigana?: FuriganaSegment[];
  meaning: LocalizedText;
  emoji: string | null;
  color: string | null;
}
