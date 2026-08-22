import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'typekana:settings';

interface Settings {
  kanjiMode: boolean;
  hintMode: boolean;
  blindMode: boolean;
}

interface SettingsContextValue extends Settings {
  loaded: boolean;
  setKanjiMode: (value: boolean) => void;
  setHintMode: (value: boolean) => void;
  setBlindMode: (value: boolean) => void;
}

const DEFAULT_SETTINGS: Settings = { kanjiMode: false, hintMode: false, blindMode: false };

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
      })
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
