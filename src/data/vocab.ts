import rawVocab from './vocab.json';
import type { Category, VocabWord } from '../types/vocab';

export const VOCAB: VocabWord[] = rawVocab as VocabWord[];

export const RANDOM_CATEGORY_ID = 'aleatoire';

export const CATEGORIES: Category[] = [
  { id: RANDOM_CATEGORY_ID, label: 'Aléatoire', emoji: '🎲', glyph: '運' },
  { id: 'animaux', label: 'Animaux', emoji: '🐾', glyph: '獣' },
  { id: 'transports', label: 'Transports', emoji: '🚗', glyph: '車' },
  { id: 'nourriture', label: 'Nourriture', emoji: '🍜', glyph: '食' },
  { id: 'couleurs_base', label: 'Couleurs de base', emoji: '🎨', glyph: '色' },
  { id: 'couleurs_avancees', label: 'Couleurs avancées', emoji: '🌈', glyph: '彩' },
  { id: 'verbes', label: 'Verbes', emoji: '🏃', glyph: '動' },
  { id: 'famille', label: 'Famille', emoji: '👪', glyph: '家' },
  { id: 'corps', label: 'Corps humain', emoji: '🧍', glyph: '体' },
  { id: 'vetements', label: 'Vêtements', emoji: '👕', glyph: '服' },
  { id: 'meteo', label: 'Météo', emoji: '🌦️', glyph: '天' },
  { id: 'chiffres', label: 'Chiffres', emoji: '🔢', glyph: '数' },
  { id: 'metiers', label: 'Métiers', emoji: '💼', glyph: '職' },
  { id: 'calendrier', label: 'Calendrier', emoji: '📅', glyph: '暦' },
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
