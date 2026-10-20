import { useTrip } from '../context/TripContext';
import { useI18n } from '../i18n/I18nContext';

interface TripButtonProps {
  id: string;
  type: 'destination' | 'route';
  slug: string;
  name: string;
  className?: string;
}

export default function TripButton({ id, type, slug, name, className = '' }: TripButtonProps) {
  const { isInTrip, addToTrip, removeFromTrip } = useTrip();
  const { t } = useI18n();
  const inTrip = isInTrip(id);

  return (
    <button
      onClick={() => (inTrip ? removeFromTrip(id) : addToTrip({ id, type, slug, name }))}
      className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
        inTrip
          ? 'border-nature bg-nature text-white'
          : 'border-glacial text-glacial-dark hover:bg-glacial hover:text-white'
      } ${className}`}
    >
      {inTrip ? `✓ ${t('common.removeFromTrip')}` : `+ ${t('common.addToTrip')}`}
    </button>
  );
}
