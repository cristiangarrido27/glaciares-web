import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import { useTrip } from '../context/TripContext';
import { useI18n } from '../i18n/I18nContext';

export default function MyTrip() {
  const { t } = useI18n();
  const { tripItems, removeFromTrip, clearTrip, history, clearHistory } = useTrip();

  const shareText = encodeURIComponent(
    `Mi itinerario en Copiloto Patagonia:\n${tripItems.map((i) => `- ${i.name}`).join('\n')}\n\nGenerado con Copiloto Patagonia by Glaciares Rent a Car`
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <Seo title="Mi viaje" description="Tu itinerario personalizado: destinos y rutas guardados para tu viaje por la Patagonia." />
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('nav.myTrip') }]} />

      <h1 className="mt-4 font-display text-3xl font-extrabold text-glacial-dark">{t('nav.myTrip')}</h1>
      <p className="mt-2 text-rock/80">
        Destinos y rutas que agregaste a tu viaje. Se guardan solo en este dispositivo.
      </p>

      {tripItems.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-rock/60">
          Aún no has agregado destinos o rutas. Explora{' '}
          <Link to="/destinos" className="font-semibold text-glacial-dark underline">destinos</Link> o{' '}
          <Link to="/rutas" className="font-semibold text-glacial-dark underline">rutas</Link> y usa el botón
          "Agregar a mi viaje".
        </p>
      ) : (
        <>
          <ul className="mt-6 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
            {tripItems.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <Link
                    to={item.type === 'destination' ? `/destinos/${item.slug}` : `/rutas/${item.slug}`}
                    className="text-sm font-bold text-glacial-dark hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-rock/50">{item.type === 'destination' ? 'Destino' : 'Ruta'}</p>
                </div>
                <button
                  onClick={() => removeFromTrip(item.id)}
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-rock hover:border-red-400 hover:text-red-500"
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`https://wa.me/?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-nature px-5 py-2.5 text-sm font-bold text-white hover:brightness-110"
            >
              {t('common.shareWhatsapp')}
            </a>
            <button
              onClick={clearTrip}
              className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-bold text-rock hover:border-red-400 hover:text-red-500"
            >
              Vaciar itinerario
            </button>
          </div>
        </>
      )}

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold text-glacial-dark">Historial de rutas consultadas</h2>
          {history.length > 0 && (
            <button onClick={clearHistory} className="text-xs font-bold text-rock/60 hover:text-red-500">
              Borrar historial
            </button>
          )}
        </div>
        {history.length === 0 ? (
          <p className="mt-3 text-sm text-rock/60">Aún no has consultado destinos ni rutas.</p>
        ) : (
          <ul className="mt-3 space-y-1">
            {history.map((h) => (
              <li key={`${h.type}-${h.slug}`}>
                <Link
                  to={h.type === 'destination' ? `/destinos/${h.slug}` : `/rutas/${h.slug}`}
                  className="text-sm text-glacial hover:underline"
                >
                  {h.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
