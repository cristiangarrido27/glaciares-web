import { useMemo, useState } from 'react';
import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import WarningBanner from '../components/WarningBanner';
import AccommodationCard from '../components/AccommodationCard';
import accommodationsData from '../data/accommodations.json';
import type { Accommodation } from '../types';
import { useI18n } from '../i18n/I18nContext';

const accommodations = accommodationsData as Accommodation[];
const cities = ['todas', 'Punta Arenas', 'Puerto Natales', 'Torres del Paine'] as const;

export default function Lodging() {
  const { t } = useI18n();
  const [city, setCity] = useState<(typeof cities)[number]>('todas');
  const [familyOnly, setFamilyOnly] = useState(false);
  const [petsOnly, setPetsOnly] = useState(false);
  const [parkingOnly, setParkingOnly] = useState(false);
  const [breakfastOnly, setBreakfastOnly] = useState(false);
  const [accessibleOnly, setAccessibleOnly] = useState(false);

  const filtered = useMemo(() => {
    return accommodations.filter((a) => {
      if (city !== 'todas' && a.city !== city) return false;
      if (familyOnly && !a.familyFriendly) return false;
      if (petsOnly && !a.petsAllowed) return false;
      if (parkingOnly && !a.parking) return false;
      if (breakfastOnly && !a.breakfast) return false;
      if (accessibleOnly && !a.accessible) return false;
      return true;
    });
  }, [city, familyOnly, petsOnly, parkingOnly, breakfastOnly, accessibleOnly]);

  const toggleClass = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-xs font-bold ${
      active ? 'border-nature bg-nature text-white' : 'border-slate-200 text-rock hover:border-nature'
    }`;

  return (
    <div>
      <Seo
        title="Dónde alojar en Punta Arenas, Puerto Natales y Torres del Paine"
        description="Hoteles, hostales, cabañas, departamentos y camping en la Región de Magallanes, con filtros por ciudad, precio referencial y servicios."
      />
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('nav.lodging') }]} />

      <header className="mx-auto max-w-7xl px-4 pb-6 pt-6 lg:px-8">
        <h1 className="font-display text-3xl font-extrabold text-glacial-dark">{t('nav.lodging')}</h1>
        <p className="mt-2 max-w-2xl text-rock/80">{t('lodging.subtitle')}</p>
        <div className="mt-4">
          <WarningBanner message={t('warnings.listings')} variant="info" />
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-3 px-4 pb-4 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {cities.map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`rounded-full border px-4 py-1.5 text-sm font-bold ${
                city === c ? 'border-glacial bg-glacial text-white' : 'border-slate-200 text-rock hover:border-glacial'
              }`}
            >
              {c === 'todas' ? t('lodging.allCities') : c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setParkingOnly((v) => !v)} className={toggleClass(parkingOnly)}>{t('labels.lodgingFeatures.parking')}</button>
          <button onClick={() => setBreakfastOnly((v) => !v)} className={toggleClass(breakfastOnly)}>{t('labels.lodgingFeatures.breakfast')}</button>
          <button onClick={() => setAccessibleOnly((v) => !v)} className={toggleClass(accessibleOnly)}>{t('labels.lodgingFeatures.accessible')}</button>
          <button onClick={() => setFamilyOnly((v) => !v)} className={toggleClass(familyOnly)}>{t('labels.lodgingFeatures.familyFriendly')}</button>
          <button onClick={() => setPetsOnly((v) => !v)} className={toggleClass(petsOnly)}>{t('labels.lodgingFeatures.petsAllowed')}</button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <AccommodationCard key={a.slug} accommodation={a} />
          ))}
        </div>
        {filtered.length === 0 && <p className="text-sm text-rock/60">{t('lodging.noResults')}</p>}
      </div>
    </div>
  );
}
