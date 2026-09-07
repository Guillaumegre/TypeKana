import rawSentences from './sentences.json';
import type { JlptLevel, JlptSentence } from '../types/vocab';

export const SENTENCES: JlptSentence[] = rawSentences as JlptSentence[];

/**
 * Levels the app actually ships. N2 and N1 are deliberately excluded: someone at that level
 * already types Japanese daily, so a keyboard trainer has nothing to teach them — showing
 * them as "coming soon" would promise content that is never going to arrive.
 * The JlptLevel type still allows them, in case that judgement changes.
 */
export const JLPT_LEVELS: JlptLevel[] = ['N5', 'N4', 'N3'];

export function getSentencesByLevel(level: string): JlptSentence[] {
  return SENTENCES.filter((s) => s.jlpt_level === level);
}

export function getSentenceById(id: string): JlptSentence | undefined {
  return SENTENCES.find((s) => s.id === id);
}
