import { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import WarningBanner from '../components/WarningBanner';
import FavoriteButton from '../components/FavoriteButton';
import TripButton from '../components/TripButton';
import destinationsData from '../data/destinations.json';
import type { Destination } from '../types';
import { useI18n } from '../i18n/I18nContext';
import { useTrip } from '../context/TripContext';
import { L } from '../utils/localized';

const destinations = destinationsData as Destination[];

export default function DestinationDetail() {
  const { slug } = useParams();
  const { t, lang } = useI18n();
  const { addToHistory } = useTrip();
  const destination = destinations.find((d) => d.slug === slug);

  useEffect(() => {
    if (destination) {
      addToHistory({ type: 'destination', slug: destination.slug, name: destination.name });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!destination) return <Navigate to="/destinos" replace />;

  const description = L(destination.shortDescription, lang);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: destination.name,
    description,
    touristType: destination.tripTypes,
  };

  return (
    <div>
      <Seo title={destination.name} description={description} jsonLd={jsonLd} />
      <Breadcrumbs
        items={[
          { label: t('nav.home'), to: '/' },
          { label: t('nav.destinations'), to: '/destinos' },
          { label: destination.name },
        ]}
      />

      <div className="relative mt-4 h-64 w-full overflow-hidden sm:h-96">
        <img src={destination.image} alt={L(destination.imageAlt, lang)} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-glacial-dark/70 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <h1 className="font-display text-3xl font-extrabold text-white drop-shadow sm:text-4xl">
            {destination.name}
          </h1>
          <FavoriteButton id={`destination:${destination.slug}`} className="bg-white" />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        {destination.placeholderImage && (
          <p className="mb-4 text-xs text-rock/50">{t('destinationDetail.photoNotice')}</p>
        )}
        <p className="text-lg text-rock/80">{description}</p>

        <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-bold uppercase text-rock/50">{t('common.approxDistance')}</dt>
            <dd className="mt-1 text-sm font-semibold text-glacial-dark">
              {destination.distanceFromPuntaArenasKm != null
                ? `${destination.distanceFromPuntaArenasKm} km`
                : t('destinationDetail.seaAccess')}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-rock/50">{t('common.approxTime')}</dt>
            <dd className="mt-1 text-sm font-semibold text-glacial-dark">{L(destination.approxDrivingTime, lang)}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-rock/50">{t('common.roadType')}</dt>
            <dd className="mt-1 text-sm font-semibold text-glacial-dark">{t(`labels.roadType.${destination.roadType}`)}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-rock/50">{t('common.season')}</dt>
            <dd className="mt-1 text-sm font-semibold text-glacial-dark">{L(destination.bestSeason, lang)}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-rock/50">{t('common.fuel')}</dt>
            <dd className="mt-1 text-sm font-semibold text-glacial-dark">
              {destination.fuelAvailable ? t('common.yes') : t('common.no')}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-rock/50">{t('common.difficulty')}</dt>
            <dd className="mt-1 text-sm font-semibold text-glacial-dark">{t(`labels.difficulty.${destination.difficulty}`)}</dd>
          </div>
          <div className="col-span-2 sm:col-span-3">
            <dt className="text-xs font-bold uppercase text-rock/50">{t('common.recommendedVehicle')}</dt>
            <dd className="mt-1 text-sm font-semibold text-glacial-dark">{L(destination.recommendedVehicle, lang)}</dd>
          </div>
        </dl>

        <div className="mt-4">
          <WarningBanner message={t('warnings.general')} />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {destination.routeSlug && (
            <Link
              to={`/rutas/${destination.routeSlug}`}
              className="rounded-full bg-glacial px-5 py-2.5 text-sm font-bold text-white hover:bg-glacial-dark"
            >
              {t('common.viewRoute')}
            </Link>
          )}
          <a
            href={destination.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-glacial px-5 py-2.5 text-sm font-bold text-glacial-dark hover:bg-glacial hover:text-white"
          >
            {t('common.openInMaps')}
          </a>
          <TripButton
            id={`destination:${destination.slug}`}
            type="destination"
            slug={destination.slug}
            name={destination.name}
          />
        </div>

        <p className="mt-8 text-xs text-rock/50">
          {t('common.source')}: Elaboración propia Copiloto Patagonia · {t('common.lastReviewed')}: {destination.lastReviewed}
        </p>
      </div>
    </div>
  );
}
