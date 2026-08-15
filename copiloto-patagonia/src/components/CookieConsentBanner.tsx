import { Link } from 'react-router-dom';
import { useConsent } from '../context/ConsentContext';

export default function CookieConsentBanner() {
  const { cookieChoice, setCookieChoice } = useConsent();

  if (cookieChoice) return null;

  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-[70] border-t border-slate-200 bg-white/98 px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-center text-sm text-rock/80 sm:text-left">
          Usamos almacenamiento local del navegador para recordar tus favoritos, tu idioma y tu itinerario. No
          usamos cookies de rastreo publicitario. Consulta nuestra{' '}
          <Link to="/cookies" className="font-semibold text-glacial-dark underline">
            política de cookies
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => setCookieChoice('rejected')}
            className="rounded-full border border-slate-300 px-4 py-2 text-xs font-bold text-rock hover:border-glacial"
          >
            Rechazar
          </button>
          <button
            onClick={() => setCookieChoice('accepted')}
            className="rounded-full bg-glacial px-4 py-2 text-xs font-bold text-white hover:bg-glacial-dark"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
