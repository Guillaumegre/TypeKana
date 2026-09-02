import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { detectDeviceLang } from '../i18n/detect';
import type { Lang } from '../i18n/translations';

const STORAGE_KEY = 'typekana:settings';

interface Settings {
  kanjiMode: boolean;
  hintMode: boolean;
  blindMode: boolean;
  soundEnabled: boolean;
  lang: Lang;
  /** How many words a Training session serves. */
  sessionLength: number;
}

/** Offered on the settings screen; any other stored value falls back to the default. */
export const SESSION_LENGTHS = [5, 10, 15, 20] as const;

interface SettingsContextValue extends Settings {
  loaded: boolean;
  setKanjiMode: (value: boolean) => void;
  setHintMode: (value: boolean) => void;
  setBlindMode: (value: boolean) => void;
  setSoundEnabled: (value: boolean) => void;
  setLang: (value: Lang) => void;
  setSessionLength: (value: number) => void;
}

// The language defaults to the phone's own; once the user picks one it is stored and wins.
const DEFAULT_SETTINGS: Settings = {
  kanjiMode: false,
  hintMode: false,
  blindMode: false,
  soundEnabled: true,
  lang: detectDeviceLang(),
  sessionLength: 10,
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        const stored = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
        // Storage can hold anything (older build, manual edit, corruption); an unknown
        // language would make every screen look up an undefined translation table.
        if (stored.lang !== 'fr' && stored.lang !== 'en') stored.lang = DEFAULT_SETTINGS.lang;
        if (!SESSION_LENGTHS.includes(stored.sessionLength)) {
          stored.sessionLength = DEFAULT_SETTINGS.sessionLength;
        }
        setSettings(stored);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const update = (next: Partial<Settings>) => {
    setSettings((prev) => {
      const merged = { ...prev, ...next };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        loaded,
        setKanjiMode: (value) =>
          update(value ? { kanjiMode: true, blindMode: false } : { kanjiMode: false, hintMode: false, blindMode: false }),
        setHintMode: (value) => update({ hintMode: value }),
        setBlindMode: (value) => update(value ? { blindMode: value, kanjiMode: false, hintMode: false } : { blindMode: value }),
        setSoundEnabled: (value) => update({ soundEnabled: value }),
        setLang: (value) => update({ lang: value }),
        setSessionLength: (value) => update({ sessionLength: value }),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
}
