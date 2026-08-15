import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useI18n } from '../i18n/I18nContext';
import company from '../data/company.json';

export default function Footer() {
  const { t } = useI18n();
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://copiloto-patagonia.netlify.app';

  return (
    <footer className="border-t border-slate-200 bg-glacial-dark text-snow">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-display text-lg font-extrabold">{t('common.appName')}</p>
          <p className="text-xs uppercase tracking-widest text-snow/60">{t('common.byCompany')}</p>
          <p className="mt-3 text-sm text-snow/80">“Tu compañero de ruta en el fin del mundo”</p>
          <p className="mt-4 text-xs leading-relaxed text-snow/60">{t('common.notOfficial')}</p>
        </div>

        <div>
          <p className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-adventure">
            {t('nav.home')}
          </p>
          <ul className="space-y-2 text-sm text-snow/80">
            <li><Link to="/destinos" className="hover:text-white">{t('nav.destinations')}</Link></li>
            <li><Link to="/rutas" className="hover:text-white">{t('nav.routes')}</Link></li>
            <li><Link to="/donde-comer" className="hover:text-white">{t('nav.food')}</Link></li>
            <li><Link to="/donde-alojar" className="hover:text-white">{t('nav.lodging')}</Link></li>
            <li><Link to="/informacion-oficial" className="hover:text-white">{t('nav.official')}</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-adventure">
            {t('footer.legal')}
          </p>
          <ul className="space-y-2 text-sm text-snow/80">
            <li><Link to="/privacidad" className="hover:text-white">{t('footer.privacy')}</Link></li>
            <li><Link to="/cookies" className="hover:text-white">{t('footer.cookies')}</Link></li>
            <li><Link to="/terminos" className="hover:text-white">{t('footer.terms')}</Link></li>
            <li><Link to="/ayuda" className="hover:text-white">{t('common.reportIssue')}</Link></li>
          </ul>
          <p className="mt-4 text-sm text-snow/80">
            <a href={company.website} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
              {company.name}
            </a>
          </p>
          {company.instagramEmpresa && !company.instagramEmpresa.startsWith('[') && (
            <p className="mt-1 text-sm text-snow/80">{t('footer.followUs')}: {company.instagramEmpresa}</p>
          )}
        </div>

        <div className="flex flex-col items-start gap-2">
          <p className="font-display text-sm font-bold uppercase tracking-wide text-adventure">
            {t('common.install')}
          </p>
          <div className="rounded-lg bg-white p-2">
            <QRCodeSVG value={siteUrl} size={104} bgColor="#ffffff" fgColor="#083B5C" />
          </div>
          <p className="max-w-[180px] text-xs text-snow/60">Escanea para abrir Copiloto Patagonia en tu teléfono.</p>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-snow/50">
        © {new Date().getFullYear()} {t('footer.rights')}
      </div>
    </footer>
  );
}
