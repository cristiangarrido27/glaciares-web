import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export interface TripItem {
  id: string;
  type: 'destination' | 'route';
  slug: string;
  name: string;
  addedAt: string;
}

export interface HistoryEntry {
  type: 'destination' | 'route';
  slug: string;
  name: string;
  viewedAt: string;
}

interface TripContextValue {
  tripItems: TripItem[];
  isInTrip: (id: string) => boolean;
  addToTrip: (item: Omit<TripItem, 'addedAt'>) => void;
  removeFromTrip: (id: string) => void;
  clearTrip: () => void;
  history: HistoryEntry[];
  addToHistory: (entry: Omit<HistoryEntry, 'viewedAt'>) => void;
  clearHistory: () => void;
}

const TripContext = createContext<TripContextValue | null>(null);
const TRIP_KEY = 'copiloto-patagonia:trip';
const HISTORY_KEY = 'copiloto-patagonia:history';
const MAX_HISTORY = 20;

function readStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function TripProvider({ children }: { children: ReactNode }) {
  const [tripItems, setTripItems] = useState<TripItem[]>(() => readStorage(TRIP_KEY, []));
  const [history, setHistory] = useState<HistoryEntry[]>(() => readStorage(HISTORY_KEY, []));

  useEffect(() => {
    localStorage.setItem(TRIP_KEY, JSON.stringify(tripItems));
  }, [tripItems]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const isInTrip = (id: string) => tripItems.some((item) => item.id === id);

  const addToTrip: TripContextValue['addToTrip'] = (item) => {
    setTripItems((prev) =>
      prev.some((p) => p.id === item.id) ? prev : [...prev, { ...item, addedAt: new Date().toISOString() }]
    );
  };

  const removeFromTrip = (id: string) => {
    setTripItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearTrip = () => setTripItems([]);

  const addToHistory: TripContextValue['addToHistory'] = (entry) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => !(h.slug === entry.slug && h.type === entry.type));
      const next = [{ ...entry, viewedAt: new Date().toISOString() }, ...filtered];
      return next.slice(0, MAX_HISTORY);
    });
  };

  const clearHistory = () => setHistory([]);

  return (
    <TripContext.Provider
      value={{ tripItems, isInTrip, addToTrip, removeFromTrip, clearTrip, history, addToHistory, clearHistory }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrip must be used within TripProvider');
  return ctx;
}
