import rawVocab from './vocab.json';
import type { Category, VocabWord } from '../types/vocab';

export const VOCAB: VocabWord[] = rawVocab as VocabWord[];

export const CATEGORIES: Category[] = [
  { id: 'animaux', label: 'Animaux', emoji: '🐾' },
  { id: 'transports', label: 'Transports', emoji: '🚗' },
  { id: 'nourriture', label: 'Nourriture', emoji: '🍜' },
  { id: 'couleurs', label: 'Couleurs', emoji: '🎨' },
];

export function getWordsByCategory(categoryId: string): VocabWord[] {
  return VOCAB.filter((w) => w.category === categoryId);
}
