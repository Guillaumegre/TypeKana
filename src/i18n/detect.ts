import type { Lang } from './translations';

/**
 * Reads the device language from the JS engine's Intl data, which Hermes exposes on both
 * platforms — so the app can start in the right language without pulling in a native module
 * (and without forcing a rebuild). Anything that isn't French falls back to English, since
 * that is what most JLPT learners use; a failed lookup keeps French, the original language.
 */
export function detectDeviceLang(): Lang {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    if (!locale) return 'fr';
    return locale.toLowerCase().startsWith('fr') ? 'fr' : 'en';
  } catch {
    return 'fr';
  }
}
