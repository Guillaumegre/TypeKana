/**
 * IME kana input can produce different Unicode compositions for the same
 * visible characters (dakuten, っ, ー). Always normalize to NFC before
 * comparing, or visually-identical answers can be marked wrong.
 */
export function normalizeKana(input: string): string {
  return input.normalize('NFC').trim();
}

export function isKanaMatch(input: string, target: string): boolean {
  return normalizeKana(input) === normalizeKana(target);
}

export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
