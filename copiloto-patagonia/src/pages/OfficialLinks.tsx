import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import WarningBanner from '../components/WarningBanner';
import officialLinksData from '../data/official-links.json';
import type { OfficialLink } from '../types';
import { useI18n } from '../i18n/I18nContext';
import { L } from '../utils/localized';

const links = officialLinksData as OfficialLink[];

export default function OfficialLinksPage() {
  const { t, lang } = useI18n();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <Seo
        title="Información oficial de Punta Arenas"
        description="Enlaces oficiales de turismo de Punta Arenas: museos, alojamientos, cómo llegar, parques nacionales y más, con fuente y fecha de revisión."
      />
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('nav.official') }]} />

      <h1 className="mt-4 font-display text-3xl font-extrabold text-glacial-dark">{t('officialPage.title')}</h1>
      <p className="mt-2 text-rock/80">{t('officialPage.subtitle')}</p>

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
              {L(link.title, lang)} ↗
            </a>
            <p className="mt-1 text-sm text-rock/80">{L(link.description, lang)}</p>
            <p className="mt-2 text-xs text-rock/50">
              {t('common.source')}: {link.source} · {t('common.lastReviewed')}: {link.lastReviewed}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
