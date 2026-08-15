import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import { useI18n } from '../i18n/I18nContext';

export default function Privacy() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <Seo title="Aviso de privacidad" description="Aviso de privacidad de Copiloto Patagonia by Glaciares Rent a Car." />
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: 'Aviso de privacidad' }]} />

      <h1 className="mt-4 font-display text-3xl font-extrabold text-glacial-dark">Aviso de privacidad</h1>
      <div className="prose prose-slate mt-6 max-w-none space-y-4 text-sm leading-relaxed text-rock/80">
        <p>
          Copiloto Patagonia es una guía digital elaborada por Glaciares Rent a Car. Esta página describe cómo
          tratamos la información dentro de la aplicación.
        </p>
        <h2 className="font-display text-lg font-bold text-glacial-dark">Datos que guardamos en tu dispositivo</h2>
        <p>
          Tus favoritos, tu itinerario ("Mi viaje"), tu historial de rutas consultadas y tu idioma preferido se
          almacenan únicamente en el almacenamiento local (localStorage) de tu navegador o dispositivo. No enviamos
          esta información a servidores de Glaciares Rent a Car ni de terceros.
        </p>
        <h2 className="font-display text-lg font-bold text-glacial-dark">Ubicación</h2>
        <p>
          Copiloto Patagonia solo solicitará acceso a tu ubicación si utilizas una función que lo requiera
          explícitamente, y siempre pedirá tu consentimiento antes de hacerlo a través del permiso del navegador.
          Puedes rechazar esta solicitud sin que afecte el resto de las funciones de la guía.
        </p>
        <h2 className="font-display text-lg font-bold text-glacial-dark">Formularios de contacto y reporte</h2>
        <p>
          Los formularios de "Reportar información incorrecta" y de contacto abren tu aplicación de WhatsApp o
          correo electrónico predeterminada. La información que envíes queda sujeta a las políticas de privacidad de
          esas plataformas.
        </p>
        <h2 className="font-display text-lg font-bold text-glacial-dark">Enlaces externos</h2>
        <p>
          Esta guía enlaza a sitios de terceros, como Ciudad Antártica o el sitio oficial de Glaciares Rent a Car.
          No somos responsables de las prácticas de privacidad de esos sitios externos.
        </p>
        <h2 className="font-display text-lg font-bold text-glacial-dark">Contacto</h2>
        <p>
          Para consultas sobre este aviso, puedes escribir a Glaciares Rent a Car a través de los canales indicados
          en la sección "Glaciares Rent a Car" de esta guía.
        </p>
      </div>
    </div>
  );
}
