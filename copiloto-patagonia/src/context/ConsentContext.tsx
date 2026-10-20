import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type CookieChoice = 'accepted' | 'rejected' | null;

interface ConsentContextValue {
  cookieChoice: CookieChoice;
  setCookieChoice: (choice: 'accepted' | 'rejected') => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);
const STORAGE_KEY = 'copiloto-patagonia:cookie-consent';

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [cookieChoice, setCookieChoiceState] = useState<CookieChoice>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'accepted' || stored === 'rejected' ? stored : null;
  });

  useEffect(() => {
    if (cookieChoice) localStorage.setItem(STORAGE_KEY, cookieChoice);
  }, [cookieChoice]);

  const setCookieChoice = (choice: 'accepted' | 'rejected') => setCookieChoiceState(choice);

  return (
    <ConsentContext.Provider value={{ cookieChoice, setCookieChoice }}>{children}</ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error('useConsent must be used within ConsentProvider');
  return ctx;
}
