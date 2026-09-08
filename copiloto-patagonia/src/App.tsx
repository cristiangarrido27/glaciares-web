import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nProvider } from './i18n/I18nContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { TripProvider } from './context/TripContext';
import { ConsentProvider } from './context/ConsentContext';
import Layout from './components/Layout';
import { useI18n } from './i18n/I18nContext';

const Home = lazy(() => import('./pages/Home'));
const Planner = lazy(() => import('./pages/Planner'));
const Destinations = lazy(() => import('./pages/Destinations'));
const DestinationDetail = lazy(() => import('./pages/DestinationDetail'));
const RoutesPage = lazy(() => import('./pages/Routes'));
const RouteDetail = lazy(() => import('./pages/RouteDetail'));
const BeforeTravel = lazy(() => import('./pages/BeforeTravel'));
const SafeDriving = lazy(() => import('./pages/SafeDriving'));
const Food = lazy(() => import('./pages/Food'));
const Lodging = lazy(() => import('./pages/Lodging'));
const OfficialLinks = lazy(() => import('./pages/OfficialLinks'));
const RentACar = lazy(() => import('./pages/RentACar'));
const Help = lazy(() => import('./pages/Help'));
const MyTrip = lazy(() => import('./pages/MyTrip'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Cookies = lazy(() => import('./pages/Cookies'));
const Terms = lazy(() => import('./pages/Terms'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-sm font-semibold text-rock/60">
      {t('common.loading')}
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <FavoritesProvider>
        <TripProvider>
          <ConsentProvider>
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/planificador" element={<Planner />} />
                    <Route path="/destinos" element={<Destinations />} />
                    <Route path="/destinos/:slug" element={<DestinationDetail />} />
                    <Route path="/rutas" element={<RoutesPage />} />
                    <Route path="/rutas/:slug" element={<RouteDetail />} />
                    <Route path="/antes-de-viajar" element={<BeforeTravel />} />
                    <Route path="/conduccion-segura" element={<SafeDriving />} />
                    <Route path="/donde-comer" element={<Food />} />
                    <Route path="/donde-alojar" element={<Lodging />} />
                    <Route path="/informacion-oficial" element={<OfficialLinks />} />
                    <Route path="/glaciares-rent-a-car" element={<RentACar />} />
                    <Route path="/ayuda" element={<Help />} />
                    <Route path="/mi-viaje" element={<MyTrip />} />
                    <Route path="/favoritos" element={<Favorites />} />
                    <Route path="/privacidad" element={<Privacy />} />
                    <Route path="/cookies" element={<Cookies />} />
                    <Route path="/terminos" element={<Terms />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
          </ConsentProvider>
        </TripProvider>
      </FavoritesProvider>
    </I18nProvider>
  );
}
