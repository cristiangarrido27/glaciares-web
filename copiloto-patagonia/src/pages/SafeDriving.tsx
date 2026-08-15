import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import WarningBanner from '../components/WarningBanner';
import safetyTips from '../data/safety-tips.json';
import company from '../data/company.json';
import type { SafetyTip } from '../types';
import { useI18n } from '../i18n/I18nContext';
import { buildWhatsappUrl, ASSISTANCE_MESSAGE_TEMPLATE } from '../utils/whatsapp';

const tips = safetyTips as SafetyTip[];
const iconMap: Record<string, string> = {
  wind: '💨',
  snowflake: '❄️',
  road: '🛣️',
  paw: '🐾',
  fuel: '⛽',
  moon: '🌙',
  signal: '📶',
  cloud: '⛅',
  sign: '🚫',
  document: '📄',
  alert: '🚨',
};

export default function SafeDriving() {
  const { t } = useI18n();
  const isConfigured = !company.whatsappAsistencia.startsWith('[');
  const assistanceUrl = buildWhatsappUrl(company.whatsappAsistencia, ASSISTANCE_MESSAGE_TEMPLATE);

  return (
    <div>
      <Seo
        title="Conducción segura en la Patagonia"
        description="Recomendaciones de seguridad para conducir por la Patagonia: viento, hielo, ripio, fauna silvestre, combustible y qué hacer ante un accidente o panne."
      />
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('nav.safeDriving') }]} />

      <header className="mx-auto max-w-7xl px-4 pb-6 pt-6 lg:px-8">
        <h1 className="font-display text-3xl font-extrabold text-glacial-dark">{t('nav.safeDriving')}</h1>
        <p className="mt-2 max-w-2xl text-rock/80">
          La Patagonia ofrece paisajes únicos, pero exige atención especial al conducir. Revisa estas recomendaciones
          antes de salir de ruta.
        </p>
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-10 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip) => (
            <div key={tip.slug} className="rounded-2xl border border-slate-200 bg-white p-5">
              <span aria-hidden="true" className="text-2xl">{iconMap[tip.icon] ?? '⚠️'}</span>
              <h2 className="mt-2 font-display text-base font-extrabold text-glacial-dark">{tip.title}</h2>
              <p className="mt-2 text-sm text-rock/80">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="bg-glacial-dark py-12 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
          <h2 className="font-display text-2xl font-extrabold">¿Necesitas ayuda en ruta?</h2>
          <p className="mt-3 text-white/80">
            Si tienes un accidente, daño o panne con tu vehículo Glaciares Rent a Car, contáctanos de inmediato.
          </p>
          {isConfigured ? (
            <a
              href={assistanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-full bg-nature px-8 py-3 text-sm font-bold text-white shadow-lg hover:brightness-110"
            >
              Necesito asistencia por WhatsApp
            </a>
          ) : (
            <p className="mt-6 inline-block rounded-full bg-white/10 px-6 py-3 text-sm font-semibold">
              [COMPLETAR] Número de asistencia pendiente de configuración.
            </p>
          )}
          <div className="mt-6 text-left">
            <WarningBanner message={t('warnings.assistance')} variant="info" />
          </div>
        </div>
      </section>
    </div>
  );
}
