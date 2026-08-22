import rawVocab from './vocab.json';
import type { Category, VocabWord } from '../types/vocab';

export const VOCAB: VocabWord[] = rawVocab as VocabWord[];

export const CATEGORIES: Category[] = [
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
];

export function getWordsByCategory(categoryId: string): VocabWord[] {
  return VOCAB.filter((w) => w.category === categoryId);
}

export function pickRandomWord(excludeId?: string): VocabWord {
  if (VOCAB.length === 1) return VOCAB[0];
  let word: VocabWord;
  do {
    word = VOCAB[Math.floor(Math.random() * VOCAB.length)];
  } while (word.id === excludeId);
  return word;
}
