import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import company from '../data/company.json';
import { useI18n } from '../i18n/I18nContext';
import { L } from '../utils/localized';
import { buildWhatsappUrl } from '../utils/whatsapp';

export default function RentACar() {
  const { t, lang } = useI18n();
  const whatsappConfigured = !company.whatsappReservas.startsWith('[');
  const emailConfigured = !company.correoReservas.startsWith('[');
  const quoteUrl = buildWhatsappUrl(company.whatsappReservas, t('rentacarPage.quoteMessage'));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CarRental',
    name: company.name,
    url: company.website,
    areaServed: 'Región de Magallanes y de la Antártica Chilena, Chile',
  };

  return (
    <div>
      <Seo
        title="Glaciares Rent a Car — Arriendo de vehículos en Punta Arenas"
        description="Arrienda tu vehículo en Punta Arenas con Glaciares Rent a Car: kilometraje libre en la Región de Magallanes, asistencia en ruta y permiso para viajar a Argentina."
        jsonLd={jsonLd}
      />
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('nav.rentacar') }]} />

      <section className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-widest text-adventure">{company.name}</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-glacial-dark sm:text-4xl">
          {t('home.sectionRentacar')}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-rock/80">{t('home.rentacarText')}</p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {company.services.map((service) => (
            <li key={service.es} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <span aria-hidden="true" className="mt-0.5 text-lg text-nature">✓</span>
              <span className="text-sm text-rock/80">{L(service, lang)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-glacial px-6 py-3 text-sm font-bold text-white hover:bg-glacial-dark"
          >
            {t('rentacarPage.viewVehicles')}
          </a>
          {whatsappConfigured ? (
            <a
              href={quoteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-adventure px-6 py-3 text-sm font-bold text-white hover:brightness-110"
            >
              {t('rentacarPage.quoteNow')}
            </a>
          ) : (
            <span className="rounded-full bg-amber-50 px-6 py-3 text-sm font-bold text-amber-700">
              {t('rentacarPage.whatsappMissing')}
            </span>
          )}
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-2 border-glacial px-6 py-3 text-sm font-bold text-glacial-dark hover:bg-glacial hover:text-white"
          >
            {t('rentacarPage.visitCompany')}
          </a>
        </div>

        <div className="mt-10 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase text-rock/50">{t('rentacarPage.emailLabel')}</p>
            <p className="mt-1 text-sm font-semibold text-glacial-dark">
              {emailConfigured ? (
                <a href={`mailto:${company.correoReservas}`} className="hover:underline">
                  {company.correoReservas}
                </a>
              ) : (
                t('rentacarPage.emailMissing')
              )}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-rock/50">{t('rentacarPage.addressLabel')}</p>
            <p className="mt-1 text-sm font-semibold text-glacial-dark">
              {company.direccionEmpresa.startsWith('[') ? t('rentacarPage.addressMissing') : company.direccionEmpresa}
            </p>
          </div>
        </div>

        <p className="mt-6 text-xs text-rock/50">{t('rentacarPage.pricesNotice')}</p>
      </section>
    </div>
  );
}
