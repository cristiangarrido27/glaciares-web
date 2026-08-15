import { Link } from 'react-router-dom';
import type { Destination } from '../types';
import { useI18n } from '../i18n/I18nContext';
import { L } from '../utils/localized';
import FavoriteButton from './FavoriteButton';
import TripButton from './TripButton';

export default function DestinationCard({ destination }: { destination: Destination }) {
  const { t, lang } = useI18n();

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={destination.image}
          alt={L(destination.imageAlt, lang)}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <FavoriteButton id={`destination:${destination.slug}`} className="absolute right-3 top-3 bg-white/90" />
        <span className="absolute left-3 top-3 rounded-full bg-glacial-dark/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
          {t(`labels.difficulty.${destination.difficulty}`)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-lg font-extrabold text-glacial-dark">{destination.name}</h3>
        <p className="text-sm text-rock/80">{L(destination.shortDescription, lang)}</p>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-rock/70">
          <div>
            <dt className="font-semibold">{t('common.approxDistance')}</dt>
            <dd>{destination.distanceFromPuntaArenasKm != null ? `${destination.distanceFromPuntaArenasKm} km aprox.` : 'Ver detalle'}</dd>
          </div>
          <div>
            <dt className="font-semibold">{t('common.approxTime')}</dt>
            <dd>{L(destination.approxDrivingTime, lang)}</dd>
          </div>
        </dl>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          <Link
            to={`/destinos/${destination.slug}`}
            className="rounded-full bg-glacial px-4 py-1.5 text-xs font-bold text-white hover:bg-glacial-dark"
          >
            {t('common.readMore')}
          </Link>
          {destination.routeSlug && (
            <Link
              to={`/rutas/${destination.routeSlug}`}
              className="rounded-full border border-glacial px-4 py-1.5 text-xs font-bold text-glacial-dark hover:bg-glacial hover:text-white"
            >
              {t('common.viewRoute')}
            </Link>
          )}
          <a
            href={destination.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-bold text-rock hover:border-glacial"
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
      </div>
    </article>
  );
}
