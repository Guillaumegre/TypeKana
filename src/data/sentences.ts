import rawSentences from './sentences.json';
import type { JlptLevel, JlptSentence } from '../types/vocab';

export const SENTENCES: JlptSentence[] = rawSentences as JlptSentence[];

export const JLPT_LEVELS: JlptLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

export function getSentencesByLevel(level: string): JlptSentence[] {
  return SENTENCES.filter((s) => s.jlpt_level === level);
}
