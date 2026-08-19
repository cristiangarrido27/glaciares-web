import { useState } from 'react';
import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import { useI18n } from '../i18n/I18nContext';

import destinations from '../data/destinations.json';
import routes from '../data/routes.json';
import restaurants from '../data/restaurants.json';
import accommodations from '../data/accommodations.json';
import officialLinks from '../data/official-links.json';
import safetyTips from '../data/safety-tips.json';
import alerts from '../data/alerts.json';
import company from '../data/company.json';

const collections: Record<string, { label: string; file: string; data: unknown }> = {
  destinations: { label: 'Destinos', file: 'destinations.json', data: destinations },
  routes: { label: 'Rutas', file: 'routes.json', data: routes },
  restaurants: { label: 'Restaurantes', file: 'restaurants.json', data: restaurants },
  accommodations: { label: 'Alojamientos', file: 'accommodations.json', data: accommodations },
  officialLinks: { label: 'Enlaces oficiales', file: 'official-links.json', data: officialLinks },
  safetyTips: { label: 'Consejos de seguridad', file: 'safety-tips.json', data: safetyTips },
  alerts: { label: 'Alertas', file: 'alerts.json', data: alerts },
  company: { label: 'Datos de la empresa', file: 'company.json', data: company },
};

export default function Admin() {
  const { t } = useI18n();
  const [selected, setSelected] = useState('alerts');
  const [text, setText] = useState(() => JSON.stringify(collections['alerts'].data, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSelect = (key: string) => {
    setSelected(key);
    setText(JSON.stringify(collections[key].data, null, 2));
    setError(null);
    setSavedMsg(false);
  };

  const handleDownload = () => {
    try {
      const parsed = JSON.parse(text);
      const blob = new Blob([JSON.stringify(parsed, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = collections[selected].file;
      a.click();
      URL.revokeObjectURL(url);
      setError(null);
      setSavedMsg(true);
    } catch {
      setError('El JSON no es válido. Revisa la sintaxis antes de descargar.');
      setSavedMsg(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      <Seo title="Panel de administración" description="Editor de contenido de Copiloto Patagonia." />
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: 'Administración' }]} />

      <h1 className="mt-4 font-display text-3xl font-extrabold text-glacial-dark">Panel de administración</h1>
      <p className="mt-2 max-w-2xl text-sm text-rock/80">
        Copiloto Patagonia guarda todo su contenido en archivos JSON dentro de <code>src/data/</code>, sin base de
        datos. Este panel te permite editar cualquier colección y descargar el archivo actualizado para reemplazarlo
        en el proyecto antes de volver a publicar el sitio. Para edición colaborativa en línea sin tocar código,
        recomendamos conectar <strong>Decap CMS</strong> (gratuito) apuntando a esta misma carpeta — ver instrucciones
        en el README.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {Object.entries(collections).map(([key, c]) => (
          <button
            key={key}
            onClick={() => handleSelect(key)}
            className={`rounded-full border px-4 py-1.5 text-sm font-bold ${
              selected === key ? 'border-glacial bg-glacial text-white' : 'border-slate-200 text-rock hover:border-glacial'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <label htmlFor="json-editor" className="text-sm font-bold text-glacial-dark">
          {collections[selected].label} — {collections[selected].file}
        </label>
        <textarea
          id="json-editor"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setSavedMsg(false);
          }}
          spellCheck={false}
          className="mt-2 h-96 w-full rounded-xl border border-slate-300 bg-glacial-dark/95 p-4 font-mono text-xs text-snow focus:border-glacial focus:outline-none"
        />
      </div>

      {error && <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>}
      {savedMsg && (
        <p className="mt-2 text-sm font-semibold text-nature">
          Archivo descargado. Reemplaza <code>src/data/{collections[selected].file}</code> con este archivo y vuelve
          a compilar el proyecto.
        </p>
      )}

      <button
        onClick={handleDownload}
        className="mt-4 rounded-full bg-glacial px-6 py-2.5 text-sm font-bold text-white hover:bg-glacial-dark"
      >
        Descargar JSON actualizado
      </button>
    </div>
  );
}
