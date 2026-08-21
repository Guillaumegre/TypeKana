import rawVocab from './vocab.json';
import type { Category, VocabWord } from '../types/vocab';

export const VOCAB: VocabWord[] = rawVocab as VocabWord[];

export const CATEGORIES: Category[] = [
  { id: 'animaux', label: 'Animaux' },
  { id: 'transports', label: 'Transports' },
  { id: 'nourriture', label: 'Nourriture' },
  { id: 'couleurs', label: 'Couleurs' },
];

export function getWordsByCategory(categoryId: string): VocabWord[] {
  return VOCAB.filter((w) => w.category === categoryId);
}
