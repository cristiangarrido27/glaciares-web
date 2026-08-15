import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import { useI18n } from '../i18n/I18nContext';

export default function Terms() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <Seo title="Términos de uso" description="Términos de uso de Copiloto Patagonia by Glaciares Rent a Car." />
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: 'Términos de uso' }]} />

      <h1 className="mt-4 font-display text-3xl font-extrabold text-glacial-dark">Términos de uso</h1>
      <div className="prose prose-slate mt-6 max-w-none space-y-4 text-sm leading-relaxed text-rock/80">
        <p>
          Copiloto Patagonia es una guía turística digital e independiente, elaborada por Glaciares Rent a Car para
          orientar a sus clientes y a viajeros interesados en la Región de Magallanes y la Patagonia. No es un sitio
          oficial de la Municipalidad de Punta Arenas ni de ningún organismo público.
        </p>
        <h2 className="font-display text-lg font-bold text-glacial-dark">Naturaleza de la información</h2>
        <p>
          Las distancias, tiempos de viaje, condiciones de caminos, horarios y requisitos fronterizos publicados en
          esta guía son aproximados y pueden cambiar sin previo aviso. Siempre debes verificar la información
          oficial vigente antes de iniciar tu viaje.
        </p>
        <h2 className="font-display text-lg font-bold text-glacial-dark">Sin garantías de seguridad absoluta</h2>
        <p>
          Las recomendaciones de conducción segura buscan reducir riesgos, pero no garantizan la ausencia de
          accidentes o incidentes. Conducir en la Patagonia implica condiciones climáticas y de camino que pueden
          ser exigentes; la responsabilidad de conducir con precaución es siempre del conductor.
        </p>
        <h2 className="font-display text-lg font-bold text-glacial-dark">Contenido comercial</h2>
        <p>
          La sección "Glaciares Rent a Car" contiene información comercial de la empresa. El resto de la guía
          (destinos, rutas, gastronomía, alojamiento, enlaces oficiales) es contenido informativo independiente de
          la oferta comercial.
        </p>
        <h2 className="font-display text-lg font-bold text-glacial-dark">Servicios de terceros</h2>
        <p>
          Los restaurantes, alojamientos y demás servicios listados son referenciales. Glaciares Rent a Car no
          administra ni garantiza dichos servicios, salvo que exista un convenio formal vigente.
        </p>
        <h2 className="font-display text-lg font-bold text-glacial-dark">Enlaces externos</h2>
        <p>
          Esta guía incluye enlaces a sitios externos, como Ciudad Antártica. Copiloto Patagonia facilita el acceso
          a estos enlaces, pero no controla ni se responsabiliza por su contenido, vigencia o disponibilidad.
        </p>
        <h2 className="font-display text-lg font-bold text-glacial-dark">Uso del asistente de WhatsApp</h2>
        <p>
          El botón de asistencia conecta directamente con Glaciares Rent a Car por WhatsApp. No podemos garantizar
          cobertura telefónica permanente ni un tiempo exacto de respuesta o llegada de asistencia en ruta.
        </p>
      </div>
    </div>
  );
}
