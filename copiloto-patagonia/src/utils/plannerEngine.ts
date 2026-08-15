import type { Destination, TravelRoute } from '../types';

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

export function buildProposal(
  input: PlannerInput,
  routes: TravelRoute[],
  destinations: Destination[]
): PlannerProposal {
  const matchedRoute = findMatchingRoute(input.destination, routes);
  const matchedDestination = findMatchingDestination(input.destination, destinations);

  const distanceKm = matchedRoute?.distanceKm ?? matchedDestination?.distanceFromPuntaArenasKm ?? null;
  const drivingTime = matchedRoute?.drivingTime ?? matchedDestination?.approxDrivingTime ?? 'Por confirmar según destino elegido';

  const stops = matchedRoute
    ? matchedRoute.stops.map((s) => `${s.name} — ${s.note}`)
    : ['Define tus paradas en la sección Rutas o Destinos según tu itinerario.'];

  const fuelStations = matchedRoute
    ? matchedRoute.stops.filter((s) => s.type === 'combustible').map((s) => s.name)
    : [];

  const safetyRecommendations = [
    'Sal siempre con el estanque de combustible lleno cuando viajes fuera de Punta Arenas o Puerto Natales.',
    'Verifica el pronóstico del viento y las condiciones del camino antes de salir.',
    'Evita conducir de noche en rutas rurales.',
  ];
  if (input.crossingArgentina) {
    safetyRecommendations.push('Confirma el horario de atención del paso fronterizo elegido antes de viajar.');
  }
  if (matchedRoute) {
    safetyRecommendations.push(...matchedRoute.warnings);
  }

  const requiredDocuments = [
    'Cédula de identidad o pasaporte de todos los pasajeros.',
    'Licencia de conducir vigente del conductor.',
    'Contrato de arriendo del vehículo.',
  ];
  if (input.crossingArgentina) {
    requiredDocuments.push(
      'Permiso de circulación en Argentina emitido por Glaciares Rent a Car (solicitar con anticipación).',
      'Documento de seguro internacional del vehículo.'
    );
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
