import type { Restaurant } from '../types';
import { useI18n } from '../i18n/I18nContext';
import FavoriteButton from './FavoriteButton';

const categoryLabel: Record<string, string> = {
  'cordero-patagonico': 'Cordero patagónico',
  centolla: 'Centolla',
  'merluza-austral': 'Merluza austral',
  'chupe-de-centolla': 'Chupe de centolla',
  'calafate-sour': 'Calafate sour',
  cafeteria: 'Cafetería',
  'comida-rapida': 'Comida rápida',
  'restaurante-familiar': 'Restaurante familiar',
  'restaurante-premium': 'Restaurante premium',
};

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const { t } = useI18n();
  const shareText = encodeURIComponent(`${restaurant.name} — ${restaurant.city}. ${restaurant.googleMapsUrl}`);

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-full bg-glacial/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-glacial-dark">
          {categoryLabel[restaurant.category]}
        </span>
        <FavoriteButton id={`restaurant:${restaurant.slug}`} />
      </div>
      <h3 className="font-display text-base font-extrabold text-glacial-dark">{restaurant.name}</h3>
      <p className="text-xs font-semibold text-rock/60">{restaurant.city}</p>
      <p className="text-sm text-rock/80">{restaurant.description}</p>
      <p className="text-[11px] text-rock/50">{restaurant.sourceNote}</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-2">
        <a
          href={restaurant.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-glacial px-3 py-1.5 text-xs font-bold text-glacial-dark hover:bg-glacial hover:text-white"
        >
          {t('common.openInMaps')}
        </a>
        {restaurant.website && (
          <a
            href={restaurant.website}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-rock hover:border-glacial"
          >
            {t('common.website')}
          </a>
        )}
        {restaurant.phone && (
          <a href={`tel:${restaurant.phone}`} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-rock hover:border-glacial">
            {t('common.call')}
          </a>
        )}
        <a
          href={`https://wa.me/?text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-rock hover:border-nature"
        >
          {t('common.share')}
        </a>
      </div>
    </article>
  );
}
