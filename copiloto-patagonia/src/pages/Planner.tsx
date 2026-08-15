import { lazy, Suspense, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import WarningBanner from '../components/WarningBanner';
import routesData from '../data/routes.json';
import destinationsData from '../data/destinations.json';
import type { TravelRoute, Destination, TripType } from '../types';
import { useI18n } from '../i18n/I18nContext';
import { buildProposal, type PlannerInput, type PlannerProposal } from '../utils/plannerEngine';
import { generateItineraryPdf } from '../utils/pdf';

const MapView = lazy(() => import('../components/MapView'));

const routes = routesData as TravelRoute[];
const destinations = destinationsData as Destination[];
const tripTypes: TripType[] = ['naturaleza', 'fotografia', 'familia', 'aventura', 'gastronomia', 'historia', 'fauna'];
const vehicleTypeKeys = ['sedan', 'suv', 'pickup4x4', 'van'] as const;

const defaultInput: PlannerInput = {
  origin: 'Punta Arenas',
  destination: '',
  days: 3,
  passengers: 2,
  tripType: 'naturaleza',
  date: '',
  crossingArgentina: false,
  vehicleType: 'suv',
};

export default function Planner() {
  const { t, lang } = useI18n();
  const [input, setInput] = useState<PlannerInput>(defaultInput);
  const [proposal, setProposal] = useState<PlannerProposal | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setProposal(buildProposal(input, routes, destinations, lang));
  };

  const shareText = proposal
    ? encodeURIComponent(
        `Mi propuesta de ruta con Copiloto Patagonia:\n${input.origin} → ${input.destination}\nDías: ${input.days} · Pasajeros: ${input.passengers}\nDistancia aprox.: ${proposal.distanceKm ?? 'según destino'} km\nTiempo aprox.: ${proposal.drivingTime}\n\nGenerado con Copiloto Patagonia by Glaciares Rent a Car`
      )
    : '';

  const handleDownloadPdf = () => {
    if (!proposal) return;
    generateItineraryPdf(
      `Ruta ${input.origin} - ${input.destination || 'Patagonia'}`,
      `Propuesta para ${input.days} días, ${input.passengers} pasajeros, viaje tipo ${t(`planner.tripTypes.${input.tripType as TripType}`)}.`,
      [
        { heading: t('planner.suggestedStops'), lines: proposal.stops },
        { heading: t('planner.fuelStations'), lines: proposal.fuelStations.length ? proposal.fuelStations : [t('planner.checkRouteOrDestination')] },
        { heading: t('planner.safetyRecommendations'), lines: proposal.safetyRecommendations },
        { heading: t('planner.requiredDocuments'), lines: proposal.requiredDocuments },
      ],
      t('warnings.general')
    );
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <Seo
        title={t('planner.title')}
        description="Planifica tu ruta por la Patagonia: indica tu origen, destino, días de viaje y tipo de aventura, y recibe una propuesta con distancias, paradas y recomendaciones."
      />
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('planner.title') }]} />

      <h1 className="mt-4 font-display text-3xl font-extrabold text-glacial-dark">{t('planner.title')}</h1>
      <p className="mt-2 text-rock/80">{t('planner.subtitle')}</p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-5 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2">
        <div>
          <label htmlFor="origin" className="text-sm font-bold text-glacial-dark">{t('planner.origin')}</label>
          <input
            id="origin"
            required
            value={input.origin}
            onChange={(e) => setInput({ ...input, origin: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-glacial focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="destination" className="text-sm font-bold text-glacial-dark">{t('planner.destination')}</label>
          <input
            id="destination"
            required
            list="destination-options"
            value={input.destination}
            onChange={(e) => setInput({ ...input, destination: e.target.value })}
            placeholder="Ej: Torres del Paine"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-glacial focus:outline-none"
          />
          <datalist id="destination-options">
            {destinations.map((d) => (
              <option key={d.slug} value={d.name} />
            ))}
          </datalist>
        </div>
        <div>
          <label htmlFor="days" className="text-sm font-bold text-glacial-dark">{t('planner.days')}</label>
          <input
            id="days"
            type="number"
            min={1}
            max={30}
            required
            value={input.days}
            onChange={(e) => setInput({ ...input, days: Number(e.target.value) })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-glacial focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="passengers" className="text-sm font-bold text-glacial-dark">{t('planner.passengers')}</label>
          <input
            id="passengers"
            type="number"
            min={1}
            max={20}
            required
            value={input.passengers}
            onChange={(e) => setInput({ ...input, passengers: Number(e.target.value) })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-glacial focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="tripType" className="text-sm font-bold text-glacial-dark">{t('planner.tripType')}</label>
          <select
            id="tripType"
            value={input.tripType}
            onChange={(e) => setInput({ ...input, tripType: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-glacial focus:outline-none"
          >
            {tripTypes.map((tt) => (
              <option key={tt} value={tt}>
                {t(`planner.tripTypes.${tt}`)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date" className="text-sm font-bold text-glacial-dark">{t('planner.date')}</label>
          <input
            id="date"
            type="date"
            value={input.date}
            onChange={(e) => setInput({ ...input, date: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-glacial focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="vehicleType" className="text-sm font-bold text-glacial-dark">{t('planner.vehicleType')}</label>
          <select
            id="vehicleType"
            value={input.vehicleType}
            onChange={(e) => setInput({ ...input, vehicleType: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-glacial focus:outline-none"
          >
            {vehicleTypeKeys.map((v) => (
              <option key={v} value={v}>
                {t(`planner.vehicleTypes.${v}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input
            id="crossing"
            type="checkbox"
            checked={input.crossingArgentina}
            onChange={(e) => setInput({ ...input, crossingArgentina: e.target.checked })}
            className="h-5 w-5 rounded border-slate-300 text-glacial focus:ring-glacial"
          />
          <label htmlFor="crossing" className="text-sm font-semibold text-rock">{t('planner.crossingArgentina')}</label>
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="w-full rounded-full bg-adventure px-6 py-3 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.01]"
          >
            {t('planner.generate')}
          </button>
        </div>
      </form>

      {proposal && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-display text-2xl font-extrabold text-glacial-dark">{t('planner.resultTitle')}</h2>

          <div className="mt-4">
            <WarningBanner message={t('warnings.general')} />
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-bold uppercase text-rock/50">{t('common.approxDistance')}</dt>
              <dd className="mt-1 text-sm font-semibold text-glacial-dark">
                {proposal.distanceKm != null ? `${proposal.distanceKm} km` : t('planner.dependsOnDestination')}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase text-rock/50">{t('common.approxTime')}</dt>
              <dd className="mt-1 text-sm font-semibold text-glacial-dark">{proposal.drivingTime}</dd>
            </div>
            {proposal.matchedRoute && (
              <div>
                <dt className="text-xs font-bold uppercase text-rock/50">{t('planner.recommendedRoute')}</dt>
                <dd className="mt-1 text-sm font-semibold text-glacial-dark">
                  <Link to={`/rutas/${proposal.matchedRoute.slug}`} className="underline">
                    {proposal.matchedRoute.name}
                  </Link>
                </dd>
              </div>
            )}
          </dl>

          {proposal.matchedRoute && (
            <div className="mt-5">
              <Suspense fallback={<div className="h-64 w-full animate-pulse rounded-2xl bg-slate-100" />}>
                <MapView waypoints={proposal.matchedRoute.waypoints} heightClass="h-64" />
              </Suspense>
            </div>
          )}

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-display text-sm font-extrabold text-glacial-dark">{t('planner.suggestedStops')}</h3>
              <ul className="mt-2 space-y-1 text-sm text-rock/80">
                {proposal.stops.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-sm font-extrabold text-glacial-dark">{t('planner.fuelStations')}</h3>
              <ul className="mt-2 space-y-1 text-sm text-rock/80">
                {proposal.fuelStations.length ? (
                  proposal.fuelStations.map((f) => <li key={f}>• {f}</li>)
                ) : (
                  <li>{t('planner.checkRouteOrDestination')}</li>
                )}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-sm font-extrabold text-glacial-dark">{t('planner.safetyRecommendations')}</h3>
              <ul className="mt-2 space-y-1 text-sm text-rock/80">
                {proposal.safetyRecommendations.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-sm font-extrabold text-glacial-dark">{t('planner.requiredDocuments')}</h3>
              <ul className="mt-2 space-y-1 text-sm text-rock/80">
                {proposal.requiredDocuments.map((d) => (
                  <li key={d}>• {d}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`https://wa.me/?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-nature px-5 py-2.5 text-sm font-bold text-white hover:brightness-110"
            >
              {t('common.shareWhatsapp')}
            </a>
            <button
              onClick={handleDownloadPdf}
              className="rounded-full border border-glacial px-5 py-2.5 text-sm font-bold text-glacial-dark hover:bg-glacial hover:text-white"
            >
              {t('common.downloadPdf')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
