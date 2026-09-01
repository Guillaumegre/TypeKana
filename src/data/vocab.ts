import rawVocab from './vocab.json';
import type { Category, VocabWord } from '../types/vocab';

export const VOCAB: VocabWord[] = rawVocab as VocabWord[];

export const RANDOM_CATEGORY_ID = 'aleatoire';

export const CATEGORIES: Category[] = [
  { id: RANDOM_CATEGORY_ID, labelKey: 'aleatoire', emoji: '🎲', glyph: '運' },
  { id: 'animaux', labelKey: 'animaux', emoji: '🐾', glyph: '獣' },
  { id: 'transports', labelKey: 'transports', emoji: '🚗', glyph: '車' },
  { id: 'nourriture', labelKey: 'nourriture', emoji: '🍜', glyph: '食' },
  { id: 'couleurs_base', labelKey: 'couleurs_base', emoji: '🎨', glyph: '色' },
  { id: 'couleurs_avancees', labelKey: 'couleurs_avancees', emoji: '🌈', glyph: '彩' },
  { id: 'verbes', labelKey: 'verbes', emoji: '🏃', glyph: '動' },
  { id: 'famille', labelKey: 'famille', emoji: '👪', glyph: '家' },
  { id: 'corps', labelKey: 'corps', emoji: '🧍', glyph: '体' },
  { id: 'vetements', labelKey: 'vetements', emoji: '👕', glyph: '服' },
  { id: 'meteo', labelKey: 'meteo', emoji: '🌦️', glyph: '天' },
  { id: 'chiffres', labelKey: 'chiffres', emoji: '🔢', glyph: '数' },
  { id: 'metiers', labelKey: 'metiers', emoji: '💼', glyph: '職' },
  { id: 'calendrier', labelKey: 'calendrier', emoji: '📅', glyph: '暦' },
];

export function getCategory(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getWordById(id: string): VocabWord | undefined {
  return VOCAB.find((w) => w.id === id);
}

export function getWordsByCategory(categoryId: string): VocabWord[] {
  if (categoryId === RANDOM_CATEGORY_ID) return VOCAB;
  return VOCAB.filter((w) => w.category === categoryId);
}

export function getWordsByLevel(level: string): VocabWord[] {
  return VOCAB.filter((w) => w.jlpt_level === level);
}

export function pickRandomWord(excludeIds?: Set<string>): VocabWord {
  const pool = excludeIds && excludeIds.size > 0 ? VOCAB.filter((w) => !excludeIds.has(w.id)) : VOCAB;
  const source = pool.length > 0 ? pool : VOCAB;
  return source[Math.floor(Math.random() * source.length)];
}
