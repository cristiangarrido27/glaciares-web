import { useState, type FormEvent } from 'react';
import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import company from '../data/company.json';
import { useI18n } from '../i18n/I18nContext';
import { L } from '../utils/localized';
import type { LocalizedText } from '../types';
import { buildWhatsappUrl } from '../utils/whatsapp';

const faqs: { q: LocalizedText; a: LocalizedText }[] = [
  {
    q: {
      es: '¿Copiloto Patagonia es un sitio oficial de la Municipalidad de Punta Arenas?',
      en: 'Is Copiloto Patagonia an official website of the Municipality of Punta Arenas?',
      pt: 'O Copiloto Patagonia é um site oficial da Municipalidade de Punta Arenas?',
    },
    a: {
      es: 'No. Copiloto Patagonia es una guía turística independiente elaborada por Glaciares Rent a Car para sus clientes. Para información oficial de la ciudad, consulta la sección "Información oficial".',
      en: 'No. Copiloto Patagonia is an independent travel guide created by Glaciares Rent a Car for its customers. For official city information, check the "Official information" section.',
      pt: 'Não. O Copiloto Patagonia é um guia de viagem independente elaborado pela Glaciares Rent a Car para seus clientes. Para informações oficiais da cidade, consulte a seção "Informação oficial".',
    },
  },
  {
    q: {
      es: '¿Cómo solicito asistencia en ruta?',
      en: 'How do I request assistance on the road?',
      pt: 'Como solicito assistência na estrada?',
    },
    a: {
      es: 'Usa el botón flotante "Necesito asistencia" disponible en todas las páginas, o el botón dedicado en la sección "Conducción segura". Se abrirá WhatsApp con un mensaje predefinido para Glaciares Rent a Car.',
      en: 'Use the floating "I need assistance" button available on every page, or the dedicated button in the "Safe driving" section. It will open WhatsApp with a pre-filled message to Glaciares Rent a Car.',
      pt: 'Use o botão flutuante "Preciso de assistência" disponível em todas as páginas, ou o botão dedicado na seção "Condução segura". Isso abrirá o WhatsApp com uma mensagem predefinida para a Glaciares Rent a Car.',
    },
  },
  {
    q: {
      es: '¿Puedo usar la guía sin conexión a internet?',
      en: 'Can I use the guide without an internet connection?',
      pt: 'Posso usar o guia sem conexão com a internet?',
    },
    a: {
      es: 'Sí. Si instalas Copiloto Patagonia como aplicación (PWA) en tu teléfono, el contenido esencial de destinos, rutas y recomendaciones queda disponible sin conexión.',
      en: 'Yes. If you install Copiloto Patagonia as an app (PWA) on your phone, the essential content for destinations, routes and recommendations stays available offline.',
      pt: 'Sim. Se você instalar o Copiloto Patagonia como aplicativo (PWA) no seu celular, o conteúdo essencial de destinos, rotas e recomendações fica disponível offline.',
    },
  },
  {
    q: {
      es: '¿Los precios de arriendo están en esta guía?',
      en: 'Are rental prices listed in this guide?',
      pt: 'Os preços de aluguel estão neste guia?',
    },
    a: {
      es: 'No. Los precios de arriendo se cotizan directamente con Glaciares Rent a Car a través del botón "Cotizar vehículo".',
      en: 'No. Rental prices are quoted directly with Glaciares Rent a Car through the "Get a quote" button.',
      pt: 'Não. Os preços de aluguel são cotados diretamente com a Glaciares Rent a Car através do botão "Cotar veículo".',
    },
  },
  {
    q: {
      es: '¿Qué hago si encuentro un dato incorrecto o desactualizado?',
      en: 'What should I do if I find incorrect or outdated information?',
      pt: 'O que fazer se eu encontrar uma informação incorreta ou desatualizada?',
    },
    a: {
      es: 'Usa el formulario de reporte en esta misma página, o el botón "Reportar información incorrecta" disponible en el pie de página.',
      en: 'Use the report form on this same page, or the "Report incorrect information" button available in the footer.',
      pt: 'Use o formulário de relato nesta mesma página, ou o botão "Reportar informação incorreta" disponível no rodapé.',
    },
  },
];

export default function Help() {
  const { t, lang } = useI18n();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ page: '', description: '' });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: L(f.q, lang),
      acceptedAnswer: { '@type': 'Answer', text: L(f.a, lang) },
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
          <details key={f.q.es} className="group rounded-2xl border border-slate-200 bg-white p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-display text-base font-bold text-glacial-dark">
              {L(f.q, lang)}
              <span aria-hidden="true" className="text-glacial transition-transform group-open:rotate-45">＋</span>
            </summary>
            <p className="mt-3 text-sm text-rock/80">{L(f.a, lang)}</p>
          </details>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-display text-xl font-extrabold text-glacial-dark">{t('common.reportIssue')}</h2>
        <p className="mt-2 text-sm text-rock/80">{t('helpPage.reportIntro')}</p>
        {sent ? (
          <p className="mt-4 rounded-lg bg-nature/10 p-4 text-sm font-semibold text-nature">{t('helpPage.reportSent')}</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="page" className="text-sm font-bold text-glacial-dark">{t('helpPage.sectionLabel')}</label>
              <input
                id="page"
                required
                value={form.page}
                onChange={(e) => setForm({ ...form, page: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-glacial focus:outline-none"
                placeholder={t('helpPage.sectionPlaceholder')}
              />
            </div>
            <div>
              <label htmlFor="description" className="text-sm font-bold text-glacial-dark">{t('helpPage.detailLabel')}</label>
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
              {t('helpPage.submit')}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
