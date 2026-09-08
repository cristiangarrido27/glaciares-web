import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import WarningBanner from '../components/WarningBanner';
import RouteCard from '../components/RouteCard';
import routesData from '../data/routes.json';
import type { TravelRoute } from '../types';
import { useI18n } from '../i18n/I18nContext';

const routes = routesData as TravelRoute[];

export default function RoutesPage() {
  const { t } = useI18n();

  return (
    <div>
      <Seo
        title="Rutas en vehículo por la Patagonia"
        description="Itinerarios recomendados en vehículo desde Punta Arenas: Puerto Natales, Torres del Paine, Porvenir, El Calafate, Ushuaia y rutas de varios días por la Patagonia."
      />
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('nav.routes') }]} />

      <header className="mx-auto max-w-7xl px-4 pb-6 pt-6 lg:px-8">
        <h1 className="font-display text-3xl font-extrabold text-glacial-dark">{t('nav.routes')}</h1>
        <p className="mt-2 max-w-2xl text-rock/80">{t('routesPage.subtitle')}</p>
        <div className="mt-4">
          <WarningBanner message={t('warnings.general')} />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {routes.map((r) => (
            <RouteCard key={r.slug} route={r} />
          ))}
        </div>
      </div>
    </div>
  );
}
