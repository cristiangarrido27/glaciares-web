import type { Destination, Lang, LocalizedText, TravelRoute } from '../types';
import { L } from './localized';

export interface PlannerInput {
  origin: string;
  destination: string;
  days: number;
  passengers: number;
  tripType: string;
  date: string;
  crossingArgentina: boolean;
  vehicleType: string;
}

export interface PlannerProposal {
  matchedRoute: TravelRoute | null;
  matchedDestination: Destination | null;
  distanceKm: number | null;
  drivingTime: string;
  stops: string[];
  fuelStations: string[];
  safetyRecommendations: string[];
  requiredDocuments: string[];
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

export function findMatchingRoute(destinationQuery: string, routes: TravelRoute[]): TravelRoute | null {
  const q = normalize(destinationQuery);
  if (!q) return null;
  return (
    routes.find((route) => normalize(route.name).includes(q) || q.includes(normalize(route.name))) ??
    routes.find((route) => route.waypoints.some((w) => normalize(w.name).includes(q))) ??
    null
  );
}

export function findMatchingDestination(destinationQuery: string, destinations: Destination[]): Destination | null {
  const q = normalize(destinationQuery);
  if (!q) return null;
  return (
    destinations.find((d) => normalize(d.name).includes(q) || q.includes(normalize(d.name))) ?? null
  );
}

const fallbackDrivingTime: LocalizedText = {
  es: 'Por confirmar según destino elegido',
  en: 'To be confirmed based on the chosen destination',
  pt: 'A confirmar de acordo com o destino escolhido',
};

const fallbackStops: LocalizedText = {
  es: 'Define tus paradas en la sección Rutas o Destinos según tu itinerario.',
  en: 'Set your stops in the Routes or Destinations section based on your itinerary.',
  pt: 'Defina suas paradas na seção Rotas ou Destinos de acordo com o seu roteiro.',
};

const baseSafetyRecommendations: LocalizedText[] = [
  {
    es: 'Sal siempre con el estanque de combustible lleno cuando viajes fuera de Punta Arenas o Puerto Natales.',
    en: 'Always leave with a full fuel tank when traveling outside Punta Arenas or Puerto Natales.',
    pt: 'Saia sempre com o tanque de combustível cheio ao viajar para fora de Punta Arenas ou Puerto Natales.',
  },
  {
    es: 'Verifica el pronóstico del viento y las condiciones del camino antes de salir.',
    en: 'Check the wind forecast and road conditions before you leave.',
    pt: 'Verifique a previsão de vento e as condições da estrada antes de sair.',
  },
  {
    es: 'Evita conducir de noche en rutas rurales.',
    en: 'Avoid driving at night on rural routes.',
    pt: 'Evite dirigir à noite em estradas rurais.',
  },
];

const crossingArgentinaSafety: LocalizedText = {
  es: 'Confirma el horario de atención del paso fronterizo elegido antes de viajar.',
  en: 'Confirm the operating hours of the chosen border crossing before you travel.',
  pt: 'Confirme o horário de atendimento do passo de fronteira escolhido antes de viajar.',
};

const baseRequiredDocuments: LocalizedText[] = [
  {
    es: 'Cédula de identidad o pasaporte de todos los pasajeros.',
    en: 'National ID or passport for all passengers.',
    pt: 'Carteira de identidade ou passaporte de todos os passageiros.',
  },
  {
    es: 'Licencia de conducir vigente del conductor.',
    en: "The driver's valid driver's license.",
    pt: 'Carteira de motorista válida do condutor.',
  },
  {
    es: 'Contrato de arriendo del vehículo.',
    en: 'The vehicle rental contract.',
    pt: 'Contrato de aluguel do veículo.',
  },
];

const argentinaDocuments: LocalizedText[] = [
  {
    es: 'Permiso de circulación en Argentina emitido por Glaciares Rent a Car (solicitar con anticipación).',
    en: 'Argentina circulation permit issued by Glaciares Rent a Car (request in advance).',
    pt: 'Autorização de circulação na Argentina emitida pela Glaciares Rent a Car (solicitar com antecedência).',
  },
  {
    es: 'Documento de seguro internacional del vehículo.',
    en: "The vehicle's international insurance document.",
    pt: 'Documento de seguro internacional do veículo.',
  },
];

export function buildProposal(
  input: PlannerInput,
  routes: TravelRoute[],
  destinations: Destination[],
  lang: Lang
): PlannerProposal {
  const matchedRoute = findMatchingRoute(input.destination, routes);
  const matchedDestination = findMatchingDestination(input.destination, destinations);

  const distanceKm = matchedRoute?.distanceKm ?? matchedDestination?.distanceFromPuntaArenasKm ?? null;
  const drivingTime = matchedRoute
    ? L(matchedRoute.drivingTime, lang)
    : matchedDestination
      ? L(matchedDestination.approxDrivingTime, lang)
      : L(fallbackDrivingTime, lang);

  const stops = matchedRoute
    ? matchedRoute.stops.map((s) => `${s.name} — ${L(s.note, lang)}`)
    : [L(fallbackStops, lang)];

  const fuelStations = matchedRoute
    ? matchedRoute.stops.filter((s) => s.type === 'combustible').map((s) => s.name)
    : [];

  const safetyRecommendations = baseSafetyRecommendations.map((s) => L(s, lang));
  if (input.crossingArgentina) {
    safetyRecommendations.push(L(crossingArgentinaSafety, lang));
  }
  if (matchedRoute) {
    safetyRecommendations.push(...matchedRoute.warnings.map((w) => L(w, lang)));
  }

  const requiredDocuments = baseRequiredDocuments.map((d) => L(d, lang));
  if (input.crossingArgentina) {
    requiredDocuments.push(...argentinaDocuments.map((d) => L(d, lang)));
  }

  return {
    matchedRoute,
    matchedDestination,
    distanceKm,
    drivingTime,
    stops,
    fuelStations,
    safetyRecommendations,
    requiredDocuments,
  };
}
