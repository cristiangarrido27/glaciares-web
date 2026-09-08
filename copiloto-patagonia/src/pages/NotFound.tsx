import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { useI18n } from '../i18n/I18nContext';

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <Seo title="Página no encontrada" description="La página que buscas no existe en Copiloto Patagonia." />
      <span aria-hidden="true" className="text-6xl">🧭</span>
      <h1 className="mt-4 font-display text-3xl font-extrabold text-glacial-dark">Página no encontrada</h1>
      <p className="mt-3 text-rock/70">
        Parece que este camino no está en el mapa. Vuelve al inicio para seguir explorando la Patagonia.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-full bg-glacial px-6 py-3 text-sm font-bold text-white hover:bg-glacial-dark"
      >
        {t('common.backHome')}
      </Link>
    </div>
  );
}
