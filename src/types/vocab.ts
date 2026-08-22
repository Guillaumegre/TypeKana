export type JlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export interface VocabWord {
  id: string;
  kana: string;
  kanji: string | null;
  meaning_fr: string;
  category: string;
  jlpt_level: JlptLevel;
  emoji: string | null;
}

export interface Category {
  id: string;
  label: string;
}
