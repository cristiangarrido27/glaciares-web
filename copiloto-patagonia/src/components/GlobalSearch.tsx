import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import destinations from '../data/destinations.json';
import routes from '../data/routes.json';
import restaurants from '../data/restaurants.json';
import accommodations from '../data/accommodations.json';
import { useI18n } from '../i18n/I18nContext';
import type { Destination, TravelRoute, Restaurant, Accommodation } from '../types';

type ResultItem = { label: string; sublabel: string; to: string };

export default function GlobalSearch() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const results = useMemo<ResultItem[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    const destResults = (destinations as Destination[])
      .filter((d) => d.name.toLowerCase().includes(q) || d.shortDescription.toLowerCase().includes(q))
      .map((d) => ({ label: d.name, sublabel: 'Destino', to: `/destinos/${d.slug}` }));

    const routeResults = (routes as TravelRoute[])
      .filter((r) => r.name.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q))
      .map((r) => ({ label: r.name, sublabel: 'Ruta', to: `/rutas/${r.slug}` }));

    const restaurantResults = (restaurants as Restaurant[])
      .filter((r) => r.name.toLowerCase().includes(q) || r.city.toLowerCase().includes(q))
      .map((r) => ({ label: r.name, sublabel: `Gastronomía · ${r.city}`, to: '/donde-comer' }));

    const accommodationResults = (accommodations as Accommodation[])
      .filter((a) => a.name.toLowerCase().includes(q) || a.city.toLowerCase().includes(q))
      .map((a) => ({ label: a.name, sublabel: `Alojamiento · ${a.city}`, to: '/donde-alojar' }));

    return [...destResults, ...routeResults, ...restaurantResults, ...accommodationResults].slice(0, 12);
  }, [query]);

  const closeAndGo = (to: string) => {
    setOpen(false);
    setQuery('');
    navigate(to);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={t('common.search')}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-lg hover:border-glacial"
      >
        <span aria-hidden="true">🔍</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-glacial-dark/60 p-4 pt-24"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Buscador"
            className="w-full max-w-xl rounded-2xl bg-white p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('common.search')}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-glacial focus:outline-none"
            />
            <ul className="mt-3 max-h-96 overflow-y-auto">
              {results.map((r) => (
                <li key={`${r.to}-${r.label}`}>
                  <button
                    onClick={() => closeAndGo(r.to)}
                    className="flex w-full flex-col items-start rounded-lg px-3 py-2 text-left hover:bg-slate-50"
                  >
                    <span className="text-sm font-semibold text-glacial-dark">{r.label}</span>
                    <span className="text-xs text-rock/60">{r.sublabel}</span>
                  </button>
                </li>
              ))}
              {query.trim().length >= 2 && results.length === 0 && (
                <li className="px-3 py-2 text-sm text-rock/60">Sin resultados para "{query}".</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
