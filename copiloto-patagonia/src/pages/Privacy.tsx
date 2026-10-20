import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import { useI18n } from '../i18n/I18nContext';
import { L } from '../utils/localized';
import type { LocalizedText } from '../types';

const pageTitle: LocalizedText = {
  es: 'Aviso de privacidad',
  en: 'Privacy notice',
  pt: 'Aviso de privacidade',
};

const intro: LocalizedText = {
  es: 'Copiloto Patagonia es una guía digital elaborada por Glaciares Rent a Car. Esta página describe cómo tratamos la información dentro de la aplicación.',
  en: 'Copiloto Patagonia is a digital guide created by Glaciares Rent a Car. This page describes how we handle information within the app.',
  pt: 'Copiloto Patagonia é um guia digital elaborado pela Glaciares Rent a Car. Esta página descreve como tratamos as informações dentro do aplicativo.',
};

const sections: { heading: LocalizedText; body: LocalizedText }[] = [
  {
    heading: {
      es: 'Datos que guardamos en tu dispositivo',
      en: 'Data we store on your device',
      pt: 'Dados que guardamos no seu dispositivo',
    },
    body: {
      es: 'Tus favoritos, tu itinerario ("Mi viaje"), tu historial de rutas consultadas y tu idioma preferido se almacenan únicamente en el almacenamiento local (localStorage) de tu navegador o dispositivo. No enviamos esta información a servidores de Glaciares Rent a Car ni de terceros.',
      en: 'Your favorites, your itinerary ("My trip"), your history of viewed routes, and your preferred language are stored only in your browser or device\'s local storage (localStorage). We do not send this information to Glaciares Rent a Car servers or third parties.',
      pt: 'Seus favoritos, seu roteiro ("Minha viagem"), seu histórico de rotas consultadas e seu idioma preferido são armazenados apenas no armazenamento local (localStorage) do seu navegador ou dispositivo. Não enviamos essas informações para servidores da Glaciares Rent a Car nem de terceiros.',
    },
  },
  {
    heading: { es: 'Ubicación', en: 'Location', pt: 'Localização' },
    body: {
      es: 'Copiloto Patagonia solo solicitará acceso a tu ubicación si utilizas una función que lo requiera explícitamente, y siempre pedirá tu consentimiento antes de hacerlo a través del permiso del navegador. Puedes rechazar esta solicitud sin que afecte el resto de las funciones de la guía.',
      en: "Copiloto Patagonia will only request access to your location if you use a feature that explicitly requires it, and will always ask for your consent beforehand through the browser's permission prompt. You can decline this request without affecting the rest of the guide's functions.",
      pt: 'O Copiloto Patagonia só solicitará acesso à sua localização se você usar uma função que exija isso explicitamente, e sempre pedirá seu consentimento antes de fazê-lo por meio da permissão do navegador. Você pode recusar essa solicitação sem que isso afete as demais funções do guia.',
    },
  },
  {
    heading: {
      es: 'Formularios de contacto y reporte',
      en: 'Contact and report forms',
      pt: 'Formulários de contato e relato',
    },
    body: {
      es: 'Los formularios de "Reportar información incorrecta" y de contacto abren tu aplicación de WhatsApp o correo electrónico predeterminada. La información que envíes queda sujeta a las políticas de privacidad de esas plataformas.',
      en: 'The "Report incorrect information" and contact forms open your default WhatsApp or email app. Any information you send is subject to the privacy policies of those platforms.',
      pt: 'Os formulários de "Reportar informação incorreta" e de contato abrem seu aplicativo padrão de WhatsApp ou e-mail. As informações que você enviar ficam sujeitas às políticas de privacidade dessas plataformas.',
    },
  },
  {
    heading: { es: 'Enlaces externos', en: 'External links', pt: 'Links externos' },
    body: {
      es: 'Esta guía enlaza a sitios de terceros, como Ciudad Antártica o el sitio oficial de Glaciares Rent a Car. No somos responsables de las prácticas de privacidad de esos sitios externos.',
      en: "This guide links to third-party sites, such as Ciudad Antártica or Glaciares Rent a Car's official website. We are not responsible for the privacy practices of those external sites.",
      pt: 'Este guia contém links para sites de terceiros, como o Ciudad Antártica ou o site oficial da Glaciares Rent a Car. Não somos responsáveis pelas práticas de privacidade desses sites externos.',
    },
  },
  {
    heading: { es: 'Contacto', en: 'Contact', pt: 'Contato' },
    body: {
      es: 'Para consultas sobre este aviso, puedes escribir a Glaciares Rent a Car a través de los canales indicados en la sección "Glaciares Rent a Car" de esta guía.',
      en: 'For questions about this notice, you can write to Glaciares Rent a Car through the channels listed in the "Glaciares Rent a Car" section of this guide.',
      pt: 'Para dúvidas sobre este aviso, você pode escrever para a Glaciares Rent a Car pelos canais indicados na seção "Glaciares Rent a Car" deste guia.',
    },
  },
];

export default function Privacy() {
  const { t, lang } = useI18n();
  const title = L(pageTitle, lang);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <Seo title={title} description="Aviso de privacidad de Copiloto Patagonia by Glaciares Rent a Car." />
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: title }]} />

      <h1 className="mt-4 font-display text-3xl font-extrabold text-glacial-dark">{title}</h1>
      <div className="prose prose-slate mt-6 max-w-none space-y-4 text-sm leading-relaxed text-rock/80">
        <p>{L(intro, lang)}</p>
        {sections.map((section) => (
          <div key={section.heading.es}>
            <h2 className="font-display text-lg font-bold text-glacial-dark">{L(section.heading, lang)}</h2>
            <p>{L(section.body, lang)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
