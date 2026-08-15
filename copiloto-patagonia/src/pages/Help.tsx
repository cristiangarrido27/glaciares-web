import { useState, type FormEvent } from 'react';
import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import company from '../data/company.json';
import { useI18n } from '../i18n/I18nContext';
import { buildWhatsappUrl } from '../utils/whatsapp';

const faqs = [
  {
    q: '¿Copiloto Patagonia es un sitio oficial de la Municipalidad de Punta Arenas?',
    a: 'No. Copiloto Patagonia es una guía turística independiente elaborada por Glaciares Rent a Car para sus clientes. Para información oficial de la ciudad, consulta la sección "Información oficial".',
  },
  {
    q: '¿Cómo solicito asistencia en ruta?',
    a: 'Usa el botón flotante "Necesito asistencia" disponible en todas las páginas, o el botón dedicado en la sección "Conducción segura". Se abrirá WhatsApp con un mensaje predefinido para Glaciares Rent a Car.',
  },
  {
    q: '¿Puedo usar la guía sin conexión a internet?',
    a: 'Sí. Si instalas Copiloto Patagonia como aplicación (PWA) en tu teléfono, el contenido esencial de destinos, rutas y recomendaciones queda disponible sin conexión.',
  },
  {
    q: '¿Los precios de arriendo están en esta guía?',
    a: 'No. Los precios de arriendo se cotizan directamente con Glaciares Rent a Car a través del botón "Cotizar vehículo".',
  },
  {
    q: '¿Qué hago si encuentro un dato incorrecto o desactualizado?',
    a: 'Usa el formulario de reporte en esta misma página, o el botón "Reportar información incorrecta" disponible en el pie de página.',
  },
];

export default function Help() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ page: '', description: '' });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const message = `Reporte de información incorrecta en Copiloto Patagonia.\nSección/página: ${form.page}\nDetalle: ${form.description}`;
    const url = company.whatsappReservas.startsWith('[')
      ? `mailto:${company.correoReservas.startsWith('[') ? '' : company.correoReservas}?subject=Reporte%20Copiloto%20Patagonia&body=${encodeURIComponent(message)}`
      : buildWhatsappUrl(company.whatsappReservas, message);
    window.open(url, '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <Seo
        title="Ayuda"
        description="Preguntas frecuentes sobre Copiloto Patagonia, cómo pedir asistencia en ruta y cómo reportar información incorrecta."
        jsonLd={jsonLd}
      />
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('nav.help') }]} />

      <h1 className="mt-4 font-display text-3xl font-extrabold text-glacial-dark">{t('nav.help')}</h1>

      <div className="mt-6 space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-2xl border border-slate-200 bg-white p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-display text-base font-bold text-glacial-dark">
              {f.q}
              <span aria-hidden="true" className="text-glacial transition-transform group-open:rotate-45">＋</span>
            </summary>
            <p className="mt-3 text-sm text-rock/80">{f.a}</p>
          </details>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-display text-xl font-extrabold text-glacial-dark">{t('common.reportIssue')}</h2>
        <p className="mt-2 text-sm text-rock/80">
          Ayúdanos a mantener esta guía actualizada. Cuéntanos qué información encontraste incorrecta o desactualizada.
        </p>
        {sent ? (
          <p className="mt-4 rounded-lg bg-nature/10 p-4 text-sm font-semibold text-nature">
            ¡Gracias! Se abrió tu app de contacto para enviar el reporte.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="page" className="text-sm font-bold text-glacial-dark">Sección o página</label>
              <input
                id="page"
                required
                value={form.page}
                onChange={(e) => setForm({ ...form, page: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-glacial focus:outline-none"
                placeholder="Ej: Ruta Punta Arenas - Puerto Natales"
              />
            </div>
            <div>
              <label htmlFor="description" className="text-sm font-bold text-glacial-dark">Detalle del error</label>
              <textarea
                id="description"
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-glacial focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-glacial px-6 py-2.5 text-sm font-bold text-white hover:bg-glacial-dark"
            >
              Enviar reporte
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
