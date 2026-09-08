import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useI18n, type Lang } from '../i18n/I18nContext';
import GlobalSearch from './GlobalSearch';

const LANGS: { code: Lang; label: string }[] = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
  { code: 'pt', label: 'PT' },
];

export default function Header() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);

  const navItems = [
    { to: '/', label: t('nav.home') },
    { to: '/destinos', label: t('nav.destinations') },
    { to: '/rutas', label: t('nav.routes') },
    { to: '/antes-de-viajar', label: t('nav.beforeTravel') },
    { to: '/donde-comer', label: t('nav.food') },
    { to: '/donde-alojar', label: t('nav.lodging') },
    { to: '/conduccion-segura', label: t('nav.safeDriving') },
    { to: '/ayuda', label: t('nav.help') },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `whitespace-nowrap px-2 py-1 text-[13px] font-semibold transition-colors ${
      isActive ? 'text-adventure' : 'text-glacial-dark hover:text-glacial'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 lg:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Copiloto Patagonia, inicio">
          <img
            src="https://glaciaresrentacar.cl/LOGOSINFONDO.png"
            alt="Logotipo de Glaciares Rent a Car"
            className="h-11 w-11 rounded-full object-cover"
            loading="eager"
            width={44}
            height={44}
          />
          <span className="leading-tight">
            <span className="block font-display text-sm font-extrabold text-glacial-dark">
              {t('common.appName')}
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-rock/70">
              {t('common.byCompany')}
            </span>
          </span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-0.5 xl:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-1.5 xl:flex">
          <GlobalSearch />
          <Link
            to="/favoritos"
            aria-label={t('nav.favorites')}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-lg hover:border-glacial"
          >
            <span aria-hidden="true">★</span>
          </Link>
          <div className="flex items-center gap-1 rounded-full border border-slate-200 p-1" role="group" aria-label="Selector de idioma">
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={`rounded-full px-2.5 py-1 text-xs font-bold transition-colors ${
                  lang === code ? 'bg-glacial text-white' : 'text-rock hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <Link
            to="/glaciares-rent-a-car"
            className="rounded-full bg-adventure px-5 py-2 text-sm font-bold text-white shadow-sm transition-transform hover:scale-105"
          >
            {t('nav.quote')}
          </Link>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <GlobalSearch />
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" className="text-xl">
              {open ? '✕' : '☰'}
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 xl:hidden">
          <nav aria-label="Navegación móvil" className="flex flex-col gap-1 pt-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-base font-semibold ${
                    isActive ? 'bg-glacial/10 text-glacial-dark' : 'text-rock hover:bg-slate-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/favoritos"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 text-base font-semibold ${
                  isActive ? 'bg-glacial/10 text-glacial-dark' : 'text-rock hover:bg-slate-50'
                }`
              }
            >
              ★ {t('nav.favorites')}
            </NavLink>
            <NavLink
              to="/mi-viaje"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 text-base font-semibold ${
                  isActive ? 'bg-glacial/10 text-glacial-dark' : 'text-rock hover:bg-slate-50'
                }`
              }
            >
              🧳 {t('nav.myTrip')}
            </NavLink>
            <Link
              to="/glaciares-rent-a-car"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-adventure px-3 py-2.5 text-center text-base font-bold text-white"
            >
              {t('nav.quote')}
            </Link>
          </nav>
          <div className="mt-3 flex items-center gap-1 rounded-full border border-slate-200 p-1" role="group" aria-label="Selector de idioma">
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={`flex-1 rounded-full px-2.5 py-1.5 text-xs font-bold transition-colors ${
                  lang === code ? 'bg-glacial text-white' : 'text-rock hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
