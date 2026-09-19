import { getLocales } from 'expo-localization';
import type { Lang } from './translations';

/** Last-resort lookup through the JS engine's Intl data, kept from the first version. */
function intlLocale(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().locale;
  } catch {
    return undefined;
  }
}

/**
 * Reads the language the user actually chose for their device: the first entry of their
 * preferred-languages list. The engine's Intl data isn't a reliable stand-in on iOS — it
 * reports the language the *app* is localized in, which is English unless the app declares
 * French (see CFBundleLocalizations in app.json) — so a French iPhone opened the app in
 * English. Anything that isn't French falls back to English, since that is what most JLPT
 * learners use; a failed lookup keeps French, the original language.
 */
export function detectDeviceLang(): Lang {
  try {
    const code = getLocales()[0]?.languageCode?.toLowerCase();
    if (code) return code === 'fr' ? 'fr' : 'en';
  } catch {
    // Fall through to the Intl lookup below.
  }
  const locale = intlLocale();
  if (!locale) return 'fr';
  return locale.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}
