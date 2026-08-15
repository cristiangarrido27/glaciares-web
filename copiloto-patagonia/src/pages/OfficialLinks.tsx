import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import WarningBanner from '../components/WarningBanner';
import officialLinksData from '../data/official-links.json';
import type { OfficialLink } from '../types';
import { useI18n } from '../i18n/I18nContext';

const links = officialLinksData as OfficialLink[];

export default function OfficialLinksPage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <Seo
        title="Información oficial de Punta Arenas"
        description="Enlaces oficiales de turismo de Punta Arenas: museos, alojamientos, cómo llegar, parques nacionales y más, con fuente y fecha de revisión."
      />
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('nav.official') }]} />

      <h1 className="mt-4 font-display text-3xl font-extrabold text-glacial-dark">
        Información oficial de Punta Arenas
      </h1>
      <p className="mt-2 text-rock/80">
        Recopilación de enlaces útiles hacia fuentes oficiales de turismo de la ciudad, para complementar esta guía.
      </p>

      <div className="mt-4">
        <WarningBanner message={t('warnings.official')} variant="info" />
      </div>

      <ul className="mt-6 space-y-3">
        {links.map((link) => (
          <li key={link.url} className="rounded-2xl border border-slate-200 bg-white p-5">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-base font-extrabold text-glacial-dark hover:underline"
            >
              {link.title} ↗
            </a>
            <p className="mt-1 text-sm text-rock/80">{link.description}</p>
            <p className="mt-2 text-xs text-rock/50">
              {t('common.source')}: {link.source} · {t('common.lastReviewed')}: {link.lastReviewed}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
