import rawVocab from './vocab.json';
import type { Category, VocabWord } from '../types/vocab';

export const VOCAB: VocabWord[] = rawVocab as VocabWord[];

export const RANDOM_CATEGORY_ID = 'aleatoire';

export const CATEGORIES: Category[] = [
  { id: RANDOM_CATEGORY_ID, label: 'Aléatoire', emoji: '🎲' },
  { id: 'animaux', label: 'Animaux', emoji: '🐾' },
  { id: 'transports', label: 'Transports', emoji: '🚗' },
  { id: 'nourriture', label: 'Nourriture', emoji: '🍜' },
  { id: 'couleurs_base', label: 'Couleurs de base', emoji: '🎨' },
  { id: 'couleurs_avancees', label: 'Couleurs avancées', emoji: '🌈' },
  { id: 'famille', label: 'Famille', emoji: '👪' },
  { id: 'vetements', label: 'Vêtements', emoji: '👕' },
  { id: 'meteo', label: 'Météo', emoji: '🌦️' },
  { id: 'chiffres', label: 'Chiffres', emoji: '🔢' },
  { id: 'metiers', label: 'Métiers', emoji: '💼' },
  { id: 'calendrier', label: 'Calendrier', emoji: '📅' },
  { id: 'verbes', label: 'Verbes', emoji: '🏃' },
];

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
