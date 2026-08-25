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

/**
 * Kana that the IME produces by modifying the *previously typed* character in place,
 * rather than by adding a new one: dakuten (か→が), handakuten (は→ぱ), and the small-kana
 * toggle (や→ゃ, つ→っ). Grouped so a live check can tell "still composing toward the right
 * kana" apart from "wrong key entirely".
 */
const KANA_FAMILIES: string[][] = [
  ['あ', 'ぁ'],
  ['い', 'ぃ'],
  ['う', 'ぅ'],
  ['え', 'ぇ'],
  ['お', 'ぉ'],
  ['か', 'が'],
  ['き', 'ぎ'],
  ['く', 'ぐ'],
  ['け', 'げ'],
  ['こ', 'ご'],
  ['さ', 'ざ'],
  ['し', 'じ'],
  ['す', 'ず'],
  ['せ', 'ぜ'],
  ['そ', 'ぞ'],
  ['た', 'だ'],
  ['ち', 'ぢ'],
  ['つ', 'っ', 'づ'],
  ['て', 'で'],
  ['と', 'ど'],
  ['は', 'ば', 'ぱ'],
  ['ひ', 'び', 'ぴ'],
  ['ふ', 'ぶ', 'ぷ'],
  ['へ', 'べ', 'ぺ'],
  ['ほ', 'ぼ', 'ぽ'],
  ['や', 'ゃ'],
  ['ゆ', 'ゅ'],
  ['よ', 'ょ'],
  ['わ', 'ゎ'],
];

const KANA_FAMILY_OF = new Map<string, number>();
KANA_FAMILIES.forEach((family, i) => family.forEach((ch) => KANA_FAMILY_OF.set(ch, i)));

/** True if `a` and `b` are the same character, or dakuten/handakuten/small-kana variants of each other. */
export function isKanaFamilyMatch(a: string, b: string): boolean {
  if (a === b) return true;
  const familyA = KANA_FAMILY_OF.get(a);
  const familyB = KANA_FAMILY_OF.get(b);
  return familyA !== undefined && familyA === familyB;
}

/**
 * The kana keyboard always types hiragana first — katakana only appears once you pick it
 * from the conversion candidates at the end, the same way kanji does. Hiragana and katakana
 * share a fixed +0x60 codepoint offset across their common range, so this is a straight
 * character-by-character shift rather than a lookup table.
 */
export function katakanaToHiragana(input: string): string {
  return input.replace(/[ァ-ヺ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}

export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
