/**
 * IME input (kana or kanji conversion) can produce different Unicode
 * compositions for the same visible characters (dakuten, っ, ー). Always
 * normalize to NFC before comparing, or visually-identical answers can be
 * marked wrong.
 */
export function normalizeText(input: string): string {
  return input.normalize('NFC').trim();
}

export function isTextMatch(input: string, target: string): boolean {
  return normalizeText(input) === normalizeText(target);
}

export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
