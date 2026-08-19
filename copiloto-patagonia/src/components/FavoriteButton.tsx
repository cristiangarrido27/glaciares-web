import { useFavorites } from '../context/FavoritesContext';
import { useI18n } from '../i18n/I18nContext';

export default function FavoriteButton({ id, className = '' }: { id: string; className?: string }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t } = useI18n();
  const active = isFavorite(id);

  return (
    <button
      onClick={() => toggleFavorite(id)}
      aria-pressed={active}
      aria-label={active ? t('common.removeFromFavorites') : t('common.addToFavorites')}
      className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
        active ? 'border-adventure bg-adventure text-white' : 'border-slate-200 bg-white text-rock hover:border-adventure'
      } ${className}`}
    >
      <span aria-hidden="true">{active ? '★' : '☆'}</span>
    </button>
  );
}
