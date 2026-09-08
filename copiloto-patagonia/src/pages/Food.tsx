import { useMemo, useState } from 'react';
import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import WarningBanner from '../components/WarningBanner';
import RestaurantCard from '../components/RestaurantCard';
import restaurantsData from '../data/restaurants.json';
import type { Restaurant } from '../types';
import { useI18n } from '../i18n/I18nContext';

const restaurants = restaurantsData as Restaurant[];

const categoryValues: Restaurant['category'][] = [
  'cordero-patagonico',
  'centolla',
  'merluza-austral',
  'chupe-de-centolla',
  'calafate-sour',
  'cafeteria',
  'comida-rapida',
  'restaurante-familiar',
  'restaurante-premium',
];

export default function Food() {
  const { t } = useI18n();
  const [category, setCategory] = useState<Restaurant['category'] | 'todos'>('todos');

  const filtered = useMemo(
    () => (category === 'todos' ? restaurants : restaurants.filter((r) => r.category === category)),
    [category]
  );

  return (
    <div>
      <Seo
        title="Dónde comer en Punta Arenas y Puerto Natales"
        description="Gastronomía patagónica: cordero, centolla, merluza austral y más. Encuentra restaurantes por categoría en Punta Arenas y Puerto Natales."
      />
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('nav.food') }]} />

      <header className="mx-auto max-w-7xl px-4 pb-6 pt-6 lg:px-8">
        <h1 className="font-display text-3xl font-extrabold text-glacial-dark">{t('nav.food')}</h1>
        <p className="mt-2 max-w-2xl text-rock/80">{t('food.subtitle')}</p>
        <div className="mt-4">
          <WarningBanner message={t('warnings.listings')} variant="info" />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-4 lg:px-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory('todos')}
            className={`rounded-full border px-4 py-1.5 text-sm font-bold ${
              category === 'todos' ? 'border-glacial bg-glacial text-white' : 'border-slate-200 text-rock hover:border-glacial'
            }`}
          >
            {t('food.all')}
          </button>
          {categoryValues.map((value) => (
            <button
              key={value}
              onClick={() => setCategory(value)}
              className={`rounded-full border px-4 py-1.5 text-sm font-bold ${
                category === value ? 'border-glacial bg-glacial text-white' : 'border-slate-200 text-rock hover:border-glacial'
              }`}
            >
              {t(`labels.restaurantCategory.${value}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <RestaurantCard key={r.slug} restaurant={r} />
          ))}
        </div>
      </div>
    </div>
  );
}
