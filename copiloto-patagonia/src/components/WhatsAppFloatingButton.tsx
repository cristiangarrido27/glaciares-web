import { useState } from 'react';
import company from '../data/company.json';
import { buildWhatsappUrl, ASSISTANCE_MESSAGE_TEMPLATE } from '../utils/whatsapp';
import { useI18n } from '../i18n/I18nContext';

export default function WhatsAppFloatingButton() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const isConfigured = !company.whatsappAsistencia.startsWith('[');

  const url = buildWhatsappUrl(company.whatsappAsistencia, ASSISTANCE_MESSAGE_TEMPLATE);

  return (
    <div className="no-print fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      {open && (
        <div className="mb-1 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
          <p className="text-sm font-bold text-glacial-dark">Necesito asistencia</p>
          <p className="mt-1 text-xs text-rock/80">{t('warnings.assistance')}</p>
          {isConfigured ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block rounded-full bg-nature px-4 py-2 text-center text-sm font-bold text-white hover:brightness-110"
            >
              Abrir WhatsApp
            </a>
          ) : (
            <p className="mt-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-700">
              [COMPLETAR] Número de asistencia pendiente de configuración.
            </p>
          )}
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Necesito asistencia por WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-nature text-2xl text-white shadow-lg transition-transform hover:scale-105"
      >
        <span aria-hidden="true">💬</span>
      </button>
    </div>
  );
}
