import type { Accommodation } from '../types';
import { useI18n } from '../i18n/I18nContext';
import { L } from '../utils/localized';
import FavoriteButton from './FavoriteButton';

export default function AccommodationCard({ accommodation }: { accommodation: Accommodation }) {
  const { t, lang } = useI18n();

  const features = [
    accommodation.parking && t('labels.lodgingFeatures.parking'),
    accommodation.breakfast && t('labels.lodgingFeatures.breakfast'),
    accommodation.accessible && t('labels.lodgingFeatures.accessible'),
    accommodation.familyFriendly && t('labels.lodgingFeatures.familyFriendly'),
    accommodation.petsAllowed && t('labels.lodgingFeatures.petsAllowed'),
  ].filter(Boolean) as string[];

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex gap-2">
          <span className="rounded-full bg-nature/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-nature">
            {t(`labels.accommodationType.${accommodation.type}`)}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-rock">
            {t(`labels.priceRange.${accommodation.priceRange}`)}
          </span>
        </div>
        <FavoriteButton id={`accommodation:${accommodation.slug}`} />
      </div>
      <h3 className="font-display text-base font-extrabold text-glacial-dark">{accommodation.name}</h3>
      <p className="text-xs font-semibold text-rock/60">{accommodation.city}</p>
      {features.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {features.map((f) => (
            <li key={f} className="rounded-full bg-glacial/5 px-2 py-0.5 text-[11px] text-glacial-dark">
              {f}
            </li>
          ))}
        </ul>
      )}
      <p className="text-[11px] text-rock/50">{L(accommodation.sourceNote, lang)}</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-2">
        <a
          href={accommodation.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-glacial px-3 py-1.5 text-xs font-bold text-glacial-dark hover:bg-glacial hover:text-white"
        >
          {t('common.openInMaps')}
        </a>
        {accommodation.website && (
          <a
            href={accommodation.website}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-rock hover:border-glacial"
          >
            {t('common.website')}
          </a>
        )}
      </div>
    </article>
  );
}
