import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import DestinationCard from '../components/DestinationCard';
import destinationsData from '../data/destinations.json';
import safetyTips from '../data/safety-tips.json';
import company from '../data/company.json';
import type { Destination, SafetyTip } from '../types';
import { useI18n } from '../i18n/I18nContext';
import { L } from '../utils/localized';

const destinations = destinationsData as Destination[];
const featured = destinations.slice(0, 6);
const tips = (safetyTips as SafetyTip[]).slice(0, 4);

export default function Home() {
  const { t, lang } = useI18n();

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: company.name,
      description: 'Guía turística Copiloto Patagonia elaborada por Glaciares Rent a Car para viajeros en Punta Arenas y la Patagonia.',
      url: company.website,
      areaServed: 'Región de Magallanes y de la Antártica Chilena',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Cómo llegar de Punta Arenas a Puerto Natales?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'La Ruta 9 conecta Punta Arenas con Puerto Natales en aproximadamente 3 horas por camino pavimentado.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué necesito para viajar de Punta Arenas a Torres del Paine en auto?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Se recomienda salir con estanque de combustible lleno desde Puerto Natales, ya que no hay estaciones de servicio dentro del parque, y confirmar el horario de ingreso vigente.',
          },
        },
      ],
    },
  ];

  return (
    <div>
      <Seo
        title="Copiloto Patagonia by Glaciares Rent a Car"
        description="Guía digital gratuita para clientes de Glaciares Rent a Car: rutas, distancias, destinos y recomendaciones para viajar por Punta Arenas y la Patagonia."
        jsonLd={jsonLd}
      />

      <section className="relative flex min-h-[560px] items-center overflow-hidden bg-glacial-dark text-white">
        <img
          src="/images/hero-patagonia.jpg"
          alt="Estepa y montañas patagónicas al atardecer"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-glacial-dark via-glacial-dark/70 to-glacial-dark/30" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 lg:px-8">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-adventure backdrop-blur">
            {t('common.guideDisclaimer')}
          </span>
          <h1 className="mt-5 max-w-2xl font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            {t('home.heroTitle')}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/85">{t('home.heroSubtitle')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/planificador"
              className="rounded-full bg-adventure px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
            >
              {t('home.ctaPlan')}
            </Link>
            <Link
              to="/destinos"
              className="rounded-full bg-white px-6 py-3 text-sm font-bold text-glacial-dark shadow-lg transition-transform hover:scale-105"
            >
              {t('home.ctaExplore')}
            </Link>
            <Link
              to="/glaciares-rent-a-car"
              className="rounded-full border-2 border-white px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105 hover:bg-white hover:text-glacial-dark"
            >
              {t('home.ctaQuote')}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-extrabold text-glacial-dark sm:text-3xl">
            {t('home.sectionDestinations')}
          </h2>
          <Link to="/destinos" className="text-sm font-bold text-glacial hover:underline">
            {t('nav.destinations')} →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((d) => (
            <DestinationCard key={d.slug} destination={d} />
          ))}
        </div>
      </section>

      <section className="bg-glacial/5 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-extrabold text-glacial-dark sm:text-3xl">
              {t('home.sectionSafety')}
            </h2>
            <Link to="/conduccion-segura" className="text-sm font-bold text-glacial hover:underline">
              {t('nav.safeDriving')} →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tips.map((tip) => (
              <div key={tip.slug} className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-display text-sm font-extrabold text-glacial-dark">{L(tip.title, lang)}</h3>
                <p className="mt-2 text-xs text-rock/70">{L(tip.description, lang)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid items-center gap-10 rounded-3xl bg-glacial-dark px-6 py-12 text-white sm:px-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-extrabold sm:text-3xl">{t('home.sectionRentacar')}</h2>
            <p className="mt-3 max-w-md text-white/80">{t('home.rentacarText')}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/glaciares-rent-a-car"
                className="rounded-full bg-adventure px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105"
              >
                {t('nav.quote')}
              </Link>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-white px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105 hover:bg-white hover:text-glacial-dark"
              >
                {company.name}
              </a>
            </div>
          </div>
          <img
            src="/images/hero-patagonia.jpg"
            alt="Estepa y montañas patagónicas, paisaje típico de una ruta en la Región de Magallanes"
            className="hidden h-64 w-full rounded-2xl object-cover lg:block"
            loading="lazy"
          />
        </div>
      </section>
    </div>
  );
}
