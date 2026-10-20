import { Link } from 'react-router-dom';
import { useConsent } from '../context/ConsentContext';
import { useI18n } from '../i18n/I18nContext';

export default function CookieConsentBanner() {
  const { cookieChoice, setCookieChoice } = useConsent();
  const { t } = useI18n();

  if (cookieChoice) return null;

  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-[70] border-t border-slate-200 bg-white/98 px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-center text-sm text-rock/80 sm:text-left">
          {t('cookieBanner.text')}{' '}
          <Link to="/cookies" className="font-semibold text-glacial-dark underline">
            {t('cookieBanner.linkText')}
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => setCookieChoice('rejected')}
            className="rounded-full border border-slate-300 px-4 py-2 text-xs font-bold text-rock hover:border-glacial"
          >
            {t('cookieBanner.reject')}
          </button>
          <button
            onClick={() => setCookieChoice('accepted')}
            className="rounded-full bg-glacial px-4 py-2 text-xs font-bold text-white hover:bg-glacial-dark"
          >
            {t('cookieBanner.accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
