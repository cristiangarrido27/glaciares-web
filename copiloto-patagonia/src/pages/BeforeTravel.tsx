import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import WarningBanner from '../components/WarningBanner';
import { useI18n } from '../i18n/I18nContext';

const blocks = [
  {
    title: 'Cómo llegar a Punta Arenas',
    text: 'Punta Arenas cuenta con el Aeropuerto Presidente Carlos Ibáñez del Campo, con vuelos regulares desde Santiago y otras ciudades. También se puede llegar por vía terrestre desde Argentina o en transbordador desde otros puntos de la Patagonia. Consulta la sección "Cómo llegar" de Ciudad Antártica para información oficial actualizada.',
  },
  {
    title: 'Clima y vestimenta',
    text: 'El clima patagónico es cambiante durante todo el año, con viento frecuente y temperaturas frías incluso en verano. Se recomienda vestir en capas, llevar cortavientos, calzado cómodo y protección solar, ya que el viento y la radiación UV pueden ser intensos.',
  },
  {
    title: 'Horarios comerciales',
    text: 'El comercio en Punta Arenas y Puerto Natales suele operar de lunes a sábado, con horarios reducidos los domingos y festivos. Verifica los horarios vigentes en la sección oficial de Ciudad Antártica antes de planificar compras o trámites.',
  },
  {
    title: 'Moneda y medios de pago',
    text: 'La moneda oficial en Chile es el peso chileno (CLP). Las tarjetas de débito y crédito son ampliamente aceptadas en Punta Arenas y Puerto Natales, aunque en zonas rurales conviene llevar efectivo.',
  },
  {
    title: 'Internet y telefonía',
    text: 'La cobertura de datos móviles es buena en las ciudades, pero se reduce considerablemente en rutas rurales y pasos fronterizos. Descarga mapas y esta guía sin conexión antes de salir de la ciudad.',
  },
  {
    title: 'Combustible',
    text: 'Reabastece siempre en las ciudades principales (Punta Arenas, Puerto Natales) antes de salir a rutas rurales, ya que la distancia entre estaciones de servicio puede ser considerable.',
  },
  {
    title: 'Peajes',
    text: 'Las principales rutas de la Región de Magallanes actualmente no cuentan con peajes en el trayecto Punta Arenas–Puerto Natales–Torres del Paine. Verifica esta información antes de viajar, ya que puede cambiar.',
  },
  {
    title: 'Documentación personal',
    text: 'Lleva siempre tu cédula de identidad o pasaporte vigente. Si viajas con menores de edad sin ambos padres, revisa los requisitos de autorización de salida del país vigentes.',
  },
  {
    title: 'Licencia de conducir',
    text: 'Necesitas una licencia de conducir vigente y válida en Chile. Consulta con Glaciares Rent a Car si tu licencia de origen requiere un permiso internacional adicional.',
  },
  {
    title: 'Viajes con niños',
    text: 'Lleva silla infantil homologada si corresponde según la edad del menor, planifica paradas frecuentes en viajes largos y considera que algunos tramos rurales tienen pocos servicios disponibles.',
  },
  {
    title: 'Viajes a Argentina',
    text: 'Cruzar a Argentina (El Calafate, Ushuaia) requiere un permiso de circulación adicional emitido por la rent a car, además de la documentación personal y del vehículo. Solicítalo con anticipación.',
  },
  {
    title: 'Aduana y pasos fronterizos',
    text: 'Los pasos fronterizos entre Chile y Argentina tienen horarios de atención definidos y pueden cerrar por condiciones climáticas. Verifica el horario vigente antes de tu viaje y respeta las restricciones de ingreso de alimentos y productos.',
  },
  {
    title: 'Qué llevar en el vehículo',
    text: 'Se recomienda llevar agua, abrigo adicional, linterna, cargador de teléfono, botiquín básico y el contrato de arriendo. Revisa junto a Glaciares Rent a Car el equipamiento incluido en tu vehículo.',
  },
  {
    title: 'Qué hacer ante una emergencia',
    text: 'Detén el vehículo en un lugar seguro, activa las luces de emergencia y contacta a los servicios de emergencia (133 Carabineros, 131 Ambulancia, 132 Bomberos) o a Glaciares Rent a Car mediante el botón de asistencia de esta guía.',
  },
];

export default function BeforeTravel() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <Seo
        title="Antes de viajar a Punta Arenas y la Patagonia"
        description="Todo lo que debes saber antes de tu viaje: clima, documentos, moneda, combustible, aduana y qué hacer ante una emergencia en la Patagonia."
      />
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('nav.beforeTravel') }]} />

      <h1 className="mt-4 font-display text-3xl font-extrabold text-glacial-dark">{t('nav.beforeTravel')}</h1>
      <p className="mt-2 text-rock/80">Información práctica para preparar tu viaje por la Región de Magallanes.</p>

      <div className="mt-4">
        <WarningBanner message={t('warnings.general')} />
      </div>

      <div className="mt-6 space-y-3">
        {blocks.map((block) => (
          <details key={block.title} className="group rounded-2xl border border-slate-200 bg-white p-5 open:shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between font-display text-base font-bold text-glacial-dark">
              {block.title}
              <span aria-hidden="true" className="text-glacial transition-transform group-open:rotate-45">＋</span>
            </summary>
            <p className="mt-3 text-sm text-rock/80">{block.text}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
