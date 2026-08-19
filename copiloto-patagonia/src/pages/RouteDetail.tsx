import { lazy, Suspense, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import WarningBanner from '../components/WarningBanner';
import TripButton from '../components/TripButton';

const MapView = lazy(() => import('../components/MapView'));
import routesData from '../data/routes.json';
import type { TravelRoute } from '../types';
import { useI18n } from '../i18n/I18nContext';
import { useTrip } from '../context/TripContext';
import { generateItineraryPdf } from '../utils/pdf';
import { L } from '../utils/localized';

const routes = routesData as TravelRoute[];

const stopIcon: Record<string, string> = {
  mirador: '🏔️',
  restaurante: '🍽️',
  baño: '🚻',
  combustible: '⛽',
  atractivo: '📍',
  frontera: '🛂',
};

export default function RouteDetail() {
  const { slug } = useParams();
  const { t, lang } = useI18n();
  const { addToHistory } = useTrip();
  const route = routes.find((r) => r.slug === slug);

  useEffect(() => {
    if (route) addToHistory({ type: 'route', slug: route.slug, name: route.name });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!route) return <Navigate to="/rutas" replace />;

  const summary = L(route.summary, lang);
  const drivingTime = L(route.drivingTime, lang);
  const bordersText = route.bordersInvolved.length
    ? route.bordersInvolved.map((b) => L(b, lang)).join(', ')
    : t('routeDetail.none');

  const shareText = encodeURIComponent(
    `${route.name} — ${summary}\nDistancia aprox.: ${route.distanceKm ?? 'según vía'} km\nTiempo aprox.: ${drivingTime}\nVía Copiloto Patagonia (Glaciares Rent a Car)`
  );

  const handleDownloadPdf = () => {
    generateItineraryPdf(
      route.name,
      summary,
      [
        { heading: t('routeDetail.stops'), lines: route.stops.map((s) => `${s.name}: ${L(s.note, lang)}`) },
        { heading: t('routeDetail.warnings'), lines: route.warnings.map((w) => L(w, lang)) },
        {
          heading: 'Datos generales',
          lines: [
            `Distancia aproximada: ${route.distanceKm ?? 'según vía elegida'} km`,
            `Tiempo aproximado: ${drivingTime}`,
            `Salida recomendada: ${L(route.suggestedDeparture, lang)}`,
            `Fronteras involucradas: ${bordersText}`,
          ],
        },
      ],
      t('warnings.general')
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      <Seo title={route.name} description={summary} />
      <Breadcrumbs
        items={[{ label: t('nav.home'), to: '/' }, { label: t('nav.routes'), to: '/rutas' }, { label: route.name }]}
      />

      <h1 className="mt-4 font-display text-3xl font-extrabold text-glacial-dark">{route.name}</h1>
      <p className="mt-2 text-lg text-rock/80">{summary}</p>

      <div className="mt-4">
        <WarningBanner message={t('warnings.general')} />
      </div>

      <div className="mt-6">
        <Suspense fallback={<div className="h-80 w-full animate-pulse rounded-2xl bg-slate-100" />}>
          <MapView waypoints={route.waypoints} />
        </Suspense>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-bold uppercase text-rock/50">{t('routeDetail.mileage')}</dt>
          <dd className="mt-1 text-sm font-semibold text-glacial-dark">
            {route.distanceKm ?? t('routeDetail.accordingToRoute')} km
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase text-rock/50">{t('common.approxTime')}</dt>
          <dd className="mt-1 text-sm font-semibold text-glacial-dark">{drivingTime}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase text-rock/50">{t('routeDetail.departure')}</dt>
          <dd className="mt-1 text-sm font-semibold text-glacial-dark">{L(route.suggestedDeparture, lang)}</dd>
        </div>
        <div className="col-span-2 sm:col-span-3">
          <dt className="text-xs font-bold uppercase text-rock/50">{t('routeDetail.borders')}</dt>
          <dd className="mt-1 text-sm font-semibold text-glacial-dark">{bordersText}</dd>
        </div>
      </dl>

      <section className="mt-8">
        <h2 className="font-display text-xl font-extrabold text-glacial-dark">{t('routeDetail.stops')}</h2>
        <ul className="mt-3 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
          {route.stops.map((stop) => (
            <li key={stop.name} className="flex items-start gap-3 p-4">
              <span aria-hidden="true" className="text-xl">{stopIcon[stop.type]}</span>
              <div>
                <p className="text-sm font-bold text-glacial-dark">{stop.name}</p>
                <p className="text-xs text-rock/70">{L(stop.note, lang)}</p>
              </div>
              {stop.km != null && <span className="ml-auto text-xs font-semibold text-rock/50">km {stop.km}</span>}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-extrabold text-glacial-dark">{t('routeDetail.warnings')}</h2>
        <ul className="mt-3 space-y-2">
          {route.warnings.map((w) => (
            <li key={L(w, lang)}>
              <WarningBanner message={L(w, lang)} />
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <TripButton id={`route:${route.slug}`} type="route" slug={route.slug} name={route.name} />
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

      <p className="mt-8 text-xs text-rock/50">
        {t('common.source')}: Elaboración propia Copiloto Patagonia · {t('common.lastReviewed')}: {route.lastReviewed}
      </p>
    </div>
  );
}
