import { useMemo, useState } from 'react';
import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import WarningBanner from '../components/WarningBanner';
import DestinationCard from '../components/DestinationCard';
import destinationsData from '../data/destinations.json';
import type { Destination, TripType } from '../types';
import { useI18n } from '../i18n/I18nContext';

const destinations = destinationsData as Destination[];

const tripTypeOptions: TripType[] = [
  'naturaleza',
  'fotografia',
  'familia',
  'aventura',
  'gastronomia',
  'historia',
  'fauna',
];

export default function Destinations() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<TripType | 'todos'>('todos');

  const filtered = useMemo(
    () => (filter === 'todos' ? destinations : destinations.filter((d) => d.tripTypes.includes(filter))),
    [filter]
  );

  return (
    <div>
      <Seo
        title="Destinos en Punta Arenas y la Patagonia"
        description="Descubre los principales destinos turísticos cerca de Punta Arenas: distancias, tipo de camino, temporada recomendada y cómo llegar en vehículo."
      />
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('nav.destinations') }]} />

      <header className="mx-auto max-w-7xl px-4 pb-6 pt-6 lg:px-8">
        <h1 className="font-display text-3xl font-extrabold text-glacial-dark">{t('nav.destinations')}</h1>
        <p className="mt-2 max-w-2xl text-rock/80">
          Diez lugares imprescindibles para explorar desde Punta Arenas, con distancias y tiempos aproximados de
          conducción.
        </p>
        <div className="mt-4">
          <WarningBanner message={t('warnings.general')} />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-4 lg:px-8">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por tipo de viaje">
          <button
            onClick={() => setFilter('todos')}
            className={`rounded-full border px-4 py-1.5 text-sm font-bold ${
              filter === 'todos' ? 'border-glacial bg-glacial text-white' : 'border-slate-200 text-rock hover:border-glacial'
            }`}
          >
            Todos
          </button>
          {tripTypeOptions.map((tt) => (
            <button
              key={tt}
              onClick={() => setFilter(tt)}
              className={`rounded-full border px-4 py-1.5 text-sm font-bold ${
                filter === tt ? 'border-glacial bg-glacial text-white' : 'border-slate-200 text-rock hover:border-glacial'
              }`}
            >
              {t(`planner.tripTypes.${tt}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <DestinationCard key={d.slug} destination={d} />
          ))}
        </div>
      </div>
    </div>
  );
}
