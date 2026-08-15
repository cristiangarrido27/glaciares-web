import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import es from './es.json';
import en from './en.json';
import pt from './pt.json';

export type Lang = 'es' | 'en' | 'pt';

const dictionaries: Record<Lang, Record<string, unknown>> = { es, en, pt };

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (path: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function resolvePath(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

const STORAGE_KEY = 'copiloto-patagonia:lang';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'es' || stored === 'en' || stored === 'pt') return stored;
    return 'es';
  });

  const setLang = (next: Lang) => {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  const t = useMemo(() => {
    return (path: string) => {
      const value = resolvePath(dictionaries[lang], path);
      if (typeof value === 'string') return value;
      const fallback = resolvePath(dictionaries.es, path);
      return typeof fallback === 'string' ? fallback : path;
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
