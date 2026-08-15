import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import { useI18n } from '../i18n/I18nContext';
import { L } from '../utils/localized';
import type { LocalizedText } from '../types';

const pageTitle: LocalizedText = {
  es: 'Términos de uso',
  en: 'Terms of use',
  pt: 'Termos de uso',
};

const intro: LocalizedText = {
  es: 'Copiloto Patagonia es una guía turística digital e independiente, elaborada por Glaciares Rent a Car para orientar a sus clientes y a viajeros interesados en la Región de Magallanes y la Patagonia. No es un sitio oficial de la Municipalidad de Punta Arenas ni de ningún organismo público.',
  en: 'Copiloto Patagonia is an independent digital travel guide created by Glaciares Rent a Car to help its customers and travelers interested in the Magallanes Region and Patagonia. It is not an official website of the Municipality of Punta Arenas or any public agency.',
  pt: 'Copiloto Patagonia é um guia turístico digital e independente, elaborado pela Glaciares Rent a Car para orientar seus clientes e viajantes interessados na Região de Magalhães e na Patagônia. Não é um site oficial da Municipalidade de Punta Arenas nem de qualquer órgão público.',
};

const sections: { heading: LocalizedText; body: LocalizedText }[] = [
  {
    heading: {
      es: 'Naturaleza de la información',
      en: 'Nature of the information',
      pt: 'Natureza das informações',
    },
    body: {
      es: 'Las distancias, tiempos de viaje, condiciones de caminos, horarios y requisitos fronterizos publicados en esta guía son aproximados y pueden cambiar sin previo aviso. Siempre debes verificar la información oficial vigente antes de iniciar tu viaje.',
      en: 'Distances, travel times, road conditions, schedules and border requirements published in this guide are approximate and may change without notice. You should always verify current official information before starting your trip.',
      pt: 'As distâncias, tempos de viagem, condições das estradas, horários e requisitos de fronteira publicados neste guia são aproximados e podem mudar sem aviso prévio. Você deve sempre verificar a informação oficial vigente antes de iniciar sua viagem.',
    },
  },
  {
    heading: {
      es: 'Sin garantías de seguridad absoluta',
      en: 'No guarantee of absolute safety',
      pt: 'Sem garantias de segurança absoluta',
    },
    body: {
      es: 'Las recomendaciones de conducción segura buscan reducir riesgos, pero no garantizan la ausencia de accidentes o incidentes. Conducir en la Patagonia implica condiciones climáticas y de camino que pueden ser exigentes; la responsabilidad de conducir con precaución es siempre del conductor.',
      en: 'The safe driving recommendations aim to reduce risk, but do not guarantee the absence of accidents or incidents. Driving in Patagonia involves weather and road conditions that can be demanding; the responsibility to drive with caution always rests with the driver.',
      pt: 'As recomendações de condução segura buscam reduzir riscos, mas não garantem a ausência de acidentes ou incidentes. Dirigir na Patagônia envolve condições climáticas e de estrada que podem ser exigentes; a responsabilidade de dirigir com cautela é sempre do condutor.',
    },
  },
  {
    heading: { es: 'Contenido comercial', en: 'Commercial content', pt: 'Conteúdo comercial' },
    body: {
      es: 'La sección "Glaciares Rent a Car" contiene información comercial de la empresa. El resto de la guía (destinos, rutas, gastronomía, alojamiento, enlaces oficiales) es contenido informativo independiente de la oferta comercial.',
      en: 'The "Glaciares Rent a Car" section contains commercial information about the company. The rest of the guide (destinations, routes, gastronomy, lodging, official links) is informational content independent of the commercial offering.',
      pt: 'A seção "Glaciares Rent a Car" contém informações comerciais da empresa. O restante do guia (destinos, rotas, gastronomia, hospedagem, links oficiais) é conteúdo informativo independente da oferta comercial.',
    },
  },
  {
    heading: { es: 'Servicios de terceros', en: 'Third-party services', pt: 'Serviços de terceiros' },
    body: {
      es: 'Los restaurantes, alojamientos y demás servicios listados son referenciales. Glaciares Rent a Car no administra ni garantiza dichos servicios, salvo que exista un convenio formal vigente.',
      en: 'The restaurants, accommodations and other services listed are for reference only. Glaciares Rent a Car does not manage or guarantee these services, unless a formal agreement is in place.',
      pt: 'Os restaurantes, hospedagens e demais serviços listados são referenciais. A Glaciares Rent a Car não administra nem garante esses serviços, salvo se existir um acordo formal vigente.',
    },
  },
  {
    heading: { es: 'Enlaces externos', en: 'External links', pt: 'Links externos' },
    body: {
      es: 'Esta guía incluye enlaces a sitios externos, como Ciudad Antártica. Copiloto Patagonia facilita el acceso a estos enlaces, pero no controla ni se responsabiliza por su contenido, vigencia o disponibilidad.',
      en: 'This guide includes links to external sites, such as Ciudad Antártica. Copiloto Patagonia facilitates access to these links but does not control or take responsibility for their content, currency or availability.',
      pt: 'Este guia inclui links para sites externos, como o Ciudad Antártica. O Copiloto Patagonia facilita o acesso a esses links, mas não controla nem se responsabiliza por seu conteúdo, vigência ou disponibilidade.',
    },
  },
  {
    heading: {
      es: 'Uso del asistente de WhatsApp',
      en: 'Use of the WhatsApp assistant',
      pt: 'Uso do assistente do WhatsApp',
    },
    body: {
      es: 'El botón de asistencia conecta directamente con Glaciares Rent a Car por WhatsApp. No podemos garantizar cobertura telefónica permanente ni un tiempo exacto de respuesta o llegada de asistencia en ruta.',
      en: 'The assistance button connects directly with Glaciares Rent a Car via WhatsApp. We cannot guarantee permanent phone coverage or an exact response or roadside assistance arrival time.',
      pt: 'O botão de assistência conecta diretamente com a Glaciares Rent a Car pelo WhatsApp. Não podemos garantir cobertura telefônica permanente nem um tempo exato de resposta ou chegada da assistência na estrada.',
    },
  },
];

export default function Terms() {
  const { t, lang } = useI18n();
  const title = L(pageTitle, lang);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <Seo title={title} description="Términos de uso de Copiloto Patagonia by Glaciares Rent a Car." />
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
