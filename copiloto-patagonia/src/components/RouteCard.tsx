import { Link } from 'react-router-dom';
import type { TravelRoute } from '../types';
import { useI18n } from '../i18n/I18nContext';
import { L } from '../utils/localized';
import TripButton from './TripButton';

export default function RouteCard({ route }: { route: TravelRoute }) {
  const { t, lang } = useI18n();

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-extrabold text-glacial-dark">{route.name}</h3>
        <span className="shrink-0 rounded-full bg-nature/10 px-3 py-1 text-xs font-bold text-nature">
          {L(route.durationLabel, lang)}
        </span>
      </div>
      <p className="text-sm text-rock/80">{L(route.summary, lang)}</p>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-rock/70">
        <div>
          <dt className="font-semibold">{t('common.mileage')}</dt>
          <dd>{route.distanceKm != null ? `${route.distanceKm} km aprox.` : t('common.orDependsOnRoute')}</dd>
        </div>
        <div>
          <dt className="font-semibold">{t('common.approxTime')}</dt>
          <dd>{L(route.drivingTime, lang)}</dd>
        </div>
      </dl>
      {route.bordersInvolved.length > 0 && (
        <p className="text-xs font-semibold text-adventure">
          {t('common.crossesBorder')}: {route.bordersInvolved.map((b) => L(b, lang)).join(', ')}
        </p>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
        <Link
          to={`/rutas/${route.slug}`}
          className="rounded-full bg-glacial px-4 py-1.5 text-xs font-bold text-white hover:bg-glacial-dark"
        >
          {t('common.readMore')}
        </Link>
        <TripButton id={`route:${route.slug}`} type="route" slug={route.slug} name={route.name} />
      </div>
    </article>
  );
}
