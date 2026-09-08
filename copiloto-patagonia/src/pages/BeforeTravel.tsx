import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import WarningBanner from '../components/WarningBanner';
import { useI18n } from '../i18n/I18nContext';
import { L } from '../utils/localized';
import type { LocalizedText } from '../types';

const blocks: { title: LocalizedText; text: LocalizedText }[] = [
  {
    title: { es: 'Cómo llegar a Punta Arenas', en: 'How to get to Punta Arenas', pt: 'Como chegar a Punta Arenas' },
    text: {
      es: 'Punta Arenas cuenta con el Aeropuerto Presidente Carlos Ibáñez del Campo, con vuelos regulares desde Santiago y otras ciudades. También se puede llegar por vía terrestre desde Argentina o en transbordador desde otros puntos de la Patagonia. Consulta la sección "Cómo llegar" de Ciudad Antártica para información oficial actualizada.',
      en: 'Punta Arenas has the Presidente Carlos Ibáñez del Campo Airport, with regular flights from Santiago and other cities. You can also arrive overland from Argentina or by ferry from other points in Patagonia. Check the "How to get there" section on Ciudad Antártica for up-to-date official information.',
      pt: 'Punta Arenas conta com o Aeroporto Presidente Carlos Ibáñez del Campo, com voos regulares a partir de Santiago e outras cidades. Também é possível chegar por via terrestre a partir da Argentina ou de balsa a partir de outros pontos da Patagônia. Consulte a seção "Como chegar" do Ciudad Antártica para informações oficiais atualizadas.',
    },
  },
  {
    title: { es: 'Clima y vestimenta', en: 'Weather and clothing', pt: 'Clima e vestimenta' },
    text: {
      es: 'El clima patagónico es cambiante durante todo el año, con viento frecuente y temperaturas frías incluso en verano. Se recomienda vestir en capas, llevar cortavientos, calzado cómodo y protección solar, ya que el viento y la radiación UV pueden ser intensos.',
      en: 'Patagonian weather is changeable year-round, with frequent wind and cold temperatures even in summer. Dress in layers, bring a windbreaker, comfortable shoes and sun protection, since wind and UV radiation can be intense.',
      pt: 'O clima patagônico é variável durante todo o ano, com vento frequente e temperaturas frias mesmo no verão. Recomenda-se vestir-se em camadas, levar corta-vento, calçado confortável e proteção solar, já que o vento e a radiação UV podem ser intensos.',
    },
  },
  {
    title: { es: 'Horarios comerciales', en: 'Business hours', pt: 'Horários comerciais' },
    text: {
      es: 'El comercio en Punta Arenas y Puerto Natales suele operar de lunes a sábado, con horarios reducidos los domingos y festivos. Verifica los horarios vigentes en la sección oficial de Ciudad Antártica antes de planificar compras o trámites.',
      en: 'Businesses in Punta Arenas and Puerto Natales typically operate Monday through Saturday, with reduced hours on Sundays and holidays. Check current hours on the official Ciudad Antártica section before planning errands or purchases.',
      pt: 'O comércio em Punta Arenas e Puerto Natales geralmente funciona de segunda a sábado, com horários reduzidos aos domingos e feriados. Verifique os horários vigentes na seção oficial do Ciudad Antártica antes de planejar compras ou trâmites.',
    },
  },
  {
    title: { es: 'Moneda y medios de pago', en: 'Currency and payment methods', pt: 'Moeda e formas de pagamento' },
    text: {
      es: 'La moneda oficial en Chile es el peso chileno (CLP). Las tarjetas de débito y crédito son ampliamente aceptadas en Punta Arenas y Puerto Natales, aunque en zonas rurales conviene llevar efectivo.',
      en: "Chile's official currency is the Chilean peso (CLP). Debit and credit cards are widely accepted in Punta Arenas and Puerto Natales, though it's wise to carry cash in rural areas.",
      pt: 'A moeda oficial no Chile é o peso chileno (CLP). Cartões de débito e crédito são amplamente aceitos em Punta Arenas e Puerto Natales, embora em áreas rurais seja recomendável levar dinheiro em espécie.',
    },
  },
  {
    title: { es: 'Internet y telefonía', en: 'Internet and mobile phone service', pt: 'Internet e telefonia' },
    text: {
      es: 'La cobertura de datos móviles es buena en las ciudades, pero se reduce considerablemente en rutas rurales y pasos fronterizos. Descarga mapas y esta guía sin conexión antes de salir de la ciudad.',
      en: 'Mobile data coverage is good in the cities but drops considerably on rural routes and at border crossings. Download maps and this guide for offline use before leaving the city.',
      pt: 'A cobertura de dados móveis é boa nas cidades, mas diminui consideravelmente em estradas rurais e passagens de fronteira. Baixe mapas e este guia para uso offline antes de sair da cidade.',
    },
  },
  {
    title: { es: 'Combustible', en: 'Fuel', pt: 'Combustível' },
    text: {
      es: 'Reabastece siempre en las ciudades principales (Punta Arenas, Puerto Natales) antes de salir a rutas rurales, ya que la distancia entre estaciones de servicio puede ser considerable.',
      en: 'Always refuel in the main cities (Punta Arenas, Puerto Natales) before heading out on rural routes, since the distance between fuel stations can be considerable.',
      pt: 'Reabasteça sempre nas principais cidades (Punta Arenas, Puerto Natales) antes de sair para estradas rurais, já que a distância entre postos de combustível pode ser considerável.',
    },
  },
  {
    title: { es: 'Peajes', en: 'Tolls', pt: 'Pedágios' },
    text: {
      es: 'Las principales rutas de la Región de Magallanes actualmente no cuentan con peajes en el trayecto Punta Arenas–Puerto Natales–Torres del Paine. Verifica esta información antes de viajar, ya que puede cambiar.',
      en: 'The main routes in the Magallanes Region currently have no tolls on the Punta Arenas–Puerto Natales–Torres del Paine stretch. Verify this before traveling, as it may change.',
      pt: 'As principais rotas da Região de Magalhães atualmente não têm pedágios no trajeto Punta Arenas–Puerto Natales–Torres del Paine. Verifique essa informação antes de viajar, pois pode mudar.',
    },
  },
  {
    title: { es: 'Documentación personal', en: 'Personal documentation', pt: 'Documentação pessoal' },
    text: {
      es: 'Lleva siempre tu cédula de identidad o pasaporte vigente. Si viajas con menores de edad sin ambos padres, revisa los requisitos de autorización de salida del país vigentes.',
      en: 'Always carry a valid ID card or passport. If traveling with minors without both parents, check the current exit-permit requirements.',
      pt: 'Leve sempre sua carteira de identidade ou passaporte válido. Se viajar com menores de idade sem ambos os pais, verifique os requisitos vigentes de autorização de saída do país.',
    },
  },
  {
    title: { es: 'Licencia de conducir', en: "Driver's license", pt: 'Carteira de motorista' },
    text: {
      es: 'Necesitas una licencia de conducir vigente y válida en Chile. Consulta con Glaciares Rent a Car si tu licencia de origen requiere un permiso internacional adicional.',
      en: "You need a valid driver's license recognized in Chile. Check with Glaciares Rent a Car whether your home license requires an additional international permit.",
      pt: 'Você precisa de uma carteira de motorista válida e reconhecida no Chile. Consulte a Glaciares Rent a Car se a sua carteira de origem requer uma permissão internacional adicional.',
    },
  },
  {
    title: { es: 'Viajes con niños', en: 'Traveling with children', pt: 'Viagens com crianças' },
    text: {
      es: 'Lleva silla infantil homologada si corresponde según la edad del menor, planifica paradas frecuentes en viajes largos y considera que algunos tramos rurales tienen pocos servicios disponibles.',
      en: "Bring an approved child seat if required for the child's age, plan frequent stops on long trips, and keep in mind that some rural stretches have few services available.",
      pt: 'Leve cadeirinha infantil homologada conforme a idade da criança, planeje paradas frequentes em viagens longas e considere que alguns trechos rurais têm poucos serviços disponíveis.',
    },
  },
  {
    title: { es: 'Viajes a Argentina', en: 'Travel to Argentina', pt: 'Viagens à Argentina' },
    text: {
      es: 'Cruzar a Argentina (El Calafate, Ushuaia) requiere un permiso de circulación adicional emitido por la rent a car, además de la documentación personal y del vehículo. Solicítalo con anticipación.',
      en: 'Crossing into Argentina (El Calafate, Ushuaia) requires an additional circulation permit issued by the rental company, plus personal and vehicle documentation. Request it in advance.',
      pt: 'Cruzar para a Argentina (El Calafate, Ushuaia) requer uma autorização de circulação adicional emitida pela locadora, além da documentação pessoal e do veículo. Solicite com antecedência.',
    },
  },
  {
    title: { es: 'Aduana y pasos fronterizos', en: 'Customs and border crossings', pt: 'Alfândega e passagens de fronteira' },
    text: {
      es: 'Los pasos fronterizos entre Chile y Argentina tienen horarios de atención definidos y pueden cerrar por condiciones climáticas. Verifica el horario vigente antes de tu viaje y respeta las restricciones de ingreso de alimentos y productos.',
      en: 'Border crossings between Chile and Argentina have set operating hours and may close due to weather conditions. Check current hours before your trip and follow restrictions on bringing in food and other products.',
      pt: 'As passagens de fronteira entre Chile e Argentina têm horários de atendimento definidos e podem fechar por condições climáticas. Verifique o horário vigente antes da sua viagem e respeite as restrições de entrada de alimentos e produtos.',
    },
  },
  {
    title: { es: 'Qué llevar en el vehículo', en: 'What to bring in the vehicle', pt: 'O que levar no veículo' },
    text: {
      es: 'Se recomienda llevar agua, abrigo adicional, linterna, cargador de teléfono, botiquín básico y el contrato de arriendo. Revisa junto a Glaciares Rent a Car el equipamiento incluido en tu vehículo.',
      en: 'It is recommended to bring water, extra warm clothing, a flashlight, a phone charger, a basic first-aid kit, and your rental contract. Check with Glaciares Rent a Car what equipment is included in your vehicle.',
      pt: 'Recomenda-se levar água, agasalho extra, lanterna, carregador de celular, kit de primeiros socorros básico e o contrato de aluguel. Confira com a Glaciares Rent a Car o equipamento incluído no seu veículo.',
    },
  },
  {
    title: { es: 'Qué hacer ante una emergencia', en: 'What to do in an emergency', pt: 'O que fazer em caso de emergência' },
    text: {
      es: 'Detén el vehículo en un lugar seguro, activa las luces de emergencia y contacta a los servicios de emergencia (133 Carabineros, 131 Ambulancia, 132 Bomberos) o a Glaciares Rent a Car mediante el botón de asistencia de esta guía.',
      en: 'Stop the vehicle in a safe place, turn on the hazard lights, and contact emergency services (133 Police, 131 Ambulance, 132 Fire Department) or Glaciares Rent a Car using this guide\'s assistance button.',
      pt: 'Pare o veículo em um local seguro, acione o pisca-alerta e entre em contato com os serviços de emergência (133 Polícia, 131 Ambulância, 132 Bombeiros) ou com a Glaciares Rent a Car pelo botão de assistência deste guia.',
    },
  },
];

export default function BeforeTravel() {
  const { t, lang } = useI18n();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <Seo
        title="Antes de viajar a Punta Arenas y la Patagonia"
        description="Todo lo que debes saber antes de tu viaje: clima, documentos, moneda, combustible, aduana y qué hacer ante una emergencia en la Patagonia."
      />
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('nav.beforeTravel') }]} />

      <h1 className="mt-4 font-display text-3xl font-extrabold text-glacial-dark">{t('nav.beforeTravel')}</h1>
      <p className="mt-2 text-rock/80">{t('beforeTravelPage.subtitle')}</p>

      <div className="mt-4">
        <WarningBanner message={t('warnings.general')} />
      </div>

      <div className="mt-6 space-y-3">
        {blocks.map((block) => (
          <details key={block.title.es} className="group rounded-2xl border border-slate-200 bg-white p-5 open:shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between font-display text-base font-bold text-glacial-dark">
              {L(block.title, lang)}
              <span aria-hidden="true" className="text-glacial transition-transform group-open:rotate-45">＋</span>
            </summary>
            <p className="mt-3 text-sm text-rock/80">{L(block.text, lang)}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
