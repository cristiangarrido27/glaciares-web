import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import { useI18n } from '../i18n/I18nContext';
import { L } from '../utils/localized';
import type { LocalizedText } from '../types';

const pageTitle: LocalizedText = {
  es: 'Política de cookies',
  en: 'Cookie policy',
  pt: 'Política de cookies',
};

const intro: LocalizedText = {
  es: 'Copiloto Patagonia no utiliza cookies de rastreo publicitario ni de terceros. Utilizamos el almacenamiento local del navegador (localStorage) para recordar tus preferencias dentro de la aplicación:',
  en: "Copiloto Patagonia does not use advertising or third-party tracking cookies. We use the browser's local storage (localStorage) to remember your preferences within the app:",
  pt: 'O Copiloto Patagonia não utiliza cookies de rastreamento publicitário nem de terceiros. Usamos o armazenamento local do navegador (localStorage) para lembrar suas preferências dentro do aplicativo:',
};

const listItems: LocalizedText[] = [
  {
    es: 'Idioma seleccionado (español, inglés o portugués).',
    en: 'Selected language (Spanish, English or Portuguese).',
    pt: 'Idioma selecionado (espanhol, inglês ou português).',
  },
  {
    es: 'Destinos, rutas, restaurantes y alojamientos marcados como favoritos.',
    en: 'Destinations, routes, restaurants and accommodations marked as favorites.',
    pt: 'Destinos, rotas, restaurantes e hospedagens marcados como favoritos.',
  },
  {
    es: 'Elementos agregados a tu itinerario ("Mi viaje").',
    en: 'Items added to your itinerary ("My trip").',
    pt: 'Itens adicionados ao seu roteiro ("Minha viagem").',
  },
  {
    es: 'Historial de rutas y destinos consultados.',
    en: 'History of viewed routes and destinations.',
    pt: 'Histórico de rotas e destinos consultados.',
  },
  {
    es: 'Tu elección respecto a este aviso de cookies.',
    en: 'Your choice regarding this cookie notice.',
    pt: 'Sua escolha em relação a este aviso de cookies.',
  },
];

const paragraph2: LocalizedText = {
  es: 'Esta información permanece en tu propio dispositivo y puedes borrarla en cualquier momento eliminando los datos de navegación de tu navegador para este sitio, o usando las opciones de "vaciar" disponibles dentro de la aplicación.',
  en: 'This information stays on your own device, and you can delete it at any time by clearing your browser\'s browsing data for this site, or by using the "clear" options available within the app.',
  pt: 'Essas informações permanecem no seu próprio dispositivo e você pode apagá-las a qualquer momento excluindo os dados de navegação do seu navegador para este site, ou usando as opções de "esvaziar" disponíveis dentro do aplicativo.',
};

const paragraph3: LocalizedText = {
  es: 'Si instalas Copiloto Patagonia como aplicación (PWA), el mismo mecanismo de almacenamiento local permite que el contenido esencial funcione sin conexión a internet.',
  en: 'If you install Copiloto Patagonia as an app (PWA), the same local storage mechanism allows essential content to work without an internet connection.',
  pt: 'Se você instalar o Copiloto Patagonia como aplicativo (PWA), o mesmo mecanismo de armazenamento local permite que o conteúdo essencial funcione sem conexão com a internet.',
};

export default function Cookies() {
  const { t, lang } = useI18n();
  const title = L(pageTitle, lang);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <Seo title={title} description="Política de cookies y almacenamiento local de Copiloto Patagonia." />
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: title }]} />

      <h1 className="mt-4 font-display text-3xl font-extrabold text-glacial-dark">{title}</h1>
      <div className="prose prose-slate mt-6 max-w-none space-y-4 text-sm leading-relaxed text-rock/80">
        <p>{L(intro, lang)}</p>
        <ul className="list-disc space-y-1 pl-5">
          {listItems.map((item) => (
            <li key={item.es}>{L(item, lang)}</li>
          ))}
        </ul>
        <p>{L(paragraph2, lang)}</p>
        <p>{L(paragraph3, lang)}</p>
      </div>
    </div>
  );
}
