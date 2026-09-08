import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import { useFavorites } from '../context/FavoritesContext';
import { useI18n } from '../i18n/I18nContext';
import destinationsData from '../data/destinations.json';
import routesData from '../data/routes.json';
import restaurantsData from '../data/restaurants.json';
import accommodationsData from '../data/accommodations.json';
import type { Destination, TravelRoute, Restaurant, Accommodation } from '../types';
import DestinationCard from '../components/DestinationCard';
import RouteCard from '../components/RouteCard';
import RestaurantCard from '../components/RestaurantCard';
import AccommodationCard from '../components/AccommodationCard';

const destinations = destinationsData as Destination[];
const routes = routesData as TravelRoute[];
const restaurants = restaurantsData as Restaurant[];
const accommodations = accommodationsData as Accommodation[];

export default function Favorites() {
  const { t } = useI18n();
  const { favorites } = useFavorites();

  const favDestinations = destinations.filter((d) => favorites.includes(`destination:${d.slug}`));
  const favRoutes = routes.filter((r) => favorites.includes(`route:${r.slug}`));
  const favRestaurants = restaurants.filter((r) => favorites.includes(`restaurant:${r.slug}`));
  const favAccommodations = accommodations.filter((a) => favorites.includes(`accommodation:${a.slug}`));

  const empty = favorites.length === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <Seo title="Favoritos" description="Tus destinos, rutas, restaurantes y alojamientos favoritos guardados en este dispositivo." />
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('nav.favorites') }]} />

      <h1 className="mt-4 font-display text-3xl font-extrabold text-glacial-dark">{t('nav.favorites')}</h1>
      <p className="mt-2 text-rock/80">Guardados localmente en este dispositivo, sin necesidad de crear una cuenta.</p>

      {empty && (
        <p className="mt-6 rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-rock/60">
          Aún no tienes favoritos. Usa el ícono ☆ en cualquier destino, ruta, restaurante o alojamiento.
        </p>
      )}

      {favDestinations.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-xl font-extrabold text-glacial-dark">{t('nav.destinations')}</h2>
          <div className="mt-3 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favDestinations.map((d) => (
              <DestinationCard key={d.slug} destination={d} />
            ))}
          </div>
        </section>
      )}

      {favRoutes.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-xl font-extrabold text-glacial-dark">{t('nav.routes')}</h2>
          <div className="mt-3 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favRoutes.map((r) => (
              <RouteCard key={r.slug} route={r} />
            ))}
          </div>
        </section>
      )}

      {favRestaurants.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-xl font-extrabold text-glacial-dark">{t('nav.food')}</h2>
          <div className="mt-3 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favRestaurants.map((r) => (
              <RestaurantCard key={r.slug} restaurant={r} />
            ))}
          </div>
        </section>
      )}

      {favAccommodations.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-xl font-extrabold text-glacial-dark">{t('nav.lodging')}</h2>
          <div className="mt-3 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favAccommodations.map((a) => (
              <AccommodationCard key={a.slug} accommodation={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
