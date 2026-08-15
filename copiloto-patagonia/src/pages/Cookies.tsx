import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import { useI18n } from '../i18n/I18nContext';

export default function Cookies() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <Seo title="Política de cookies" description="Política de cookies y almacenamiento local de Copiloto Patagonia." />
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: 'Política de cookies' }]} />

      <h1 className="mt-4 font-display text-3xl font-extrabold text-glacial-dark">Política de cookies</h1>
      <div className="prose prose-slate mt-6 max-w-none space-y-4 text-sm leading-relaxed text-rock/80">
        <p>
          Copiloto Patagonia no utiliza cookies de rastreo publicitario ni de terceros. Utilizamos el almacenamiento
          local del navegador (localStorage) para recordar tus preferencias dentro de la aplicación:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Idioma seleccionado (español, inglés o portugués).</li>
          <li>Destinos, rutas, restaurantes y alojamientos marcados como favoritos.</li>
          <li>Elementos agregados a tu itinerario ("Mi viaje").</li>
          <li>Historial de rutas y destinos consultados.</li>
          <li>Tu elección respecto a este aviso de cookies.</li>
        </ul>
        <p>
          Esta información permanece en tu propio dispositivo y puedes borrarla en cualquier momento eliminando los
          datos de navegación de tu navegador para este sitio, o usando las opciones de "vaciar" disponibles dentro
          de la aplicación.
        </p>
        <p>
          Si instalas Copiloto Patagonia como aplicación (PWA), el mismo mecanismo de almacenamiento local permite
          que el contenido esencial funcione sin conexión a internet.
        </p>
      </div>
    </div>
  );
}
