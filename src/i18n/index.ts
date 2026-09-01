import { useSettings } from '../context/SettingsContext';
import { translations, type Lang, type Translations } from './translations';

export { detectDeviceLang } from './detect';
export type { Lang, Translations };

/** Strings for the active language. Values are plain text; anything variable is a function. */
export function useT(): Translations {
  const { lang } = useSettings();
  return translations[lang];
}

/** The active language, for picking the right side of a localized data field. */
export function useLang(): Lang {
  return useSettings().lang;
}
