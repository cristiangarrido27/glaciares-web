export type Lang = 'es' | 'en' | 'pt';
export type LocalizedText = Record<Lang, string>;

export type RoadType = 'pavimentado' | 'ripio' | 'mixto';
export type Difficulty = 'facil' | 'moderado' | 'exigente';
export type TripType =
  | 'naturaleza'
  | 'fotografia'
  | 'familia'
  | 'aventura'
  | 'gastronomia'
  | 'historia'
  | 'fauna';

export interface Destination {
  slug: string;
  name: string;
  shortDescription: LocalizedText;
  image: string;
  imageAlt: LocalizedText;
  placeholderImage: boolean;
  distanceFromPuntaArenasKm: number | null;
  approxDrivingTime: LocalizedText;
  roadType: RoadType;
  bestSeason: LocalizedText;
  fuelAvailable: boolean;
  difficulty: Difficulty;
  recommendedVehicle: LocalizedText;
  googleMapsUrl: string;
  routeSlug: string | null;
  tripTypes: TripType[];
  lastReviewed: string;
}

export interface RouteStop {
  name: string;
  type: 'mirador' | 'restaurante' | 'baño' | 'combustible' | 'atractivo' | 'frontera';
  note: LocalizedText;
  km: number | null;
  coordinates?: [number, number];
}

export interface RouteWaypoint {
  name: string;
  coordinates: [number, number];
}

export interface TravelRoute {
  slug: string;
  name: string;
  summary: LocalizedText;
  durationLabel: LocalizedText;
  distanceKm: number | null;
  drivingTime: LocalizedText;
  suggestedDeparture: LocalizedText;
  bordersInvolved: LocalizedText[];
  roadType: RoadType;
  difficulty: Difficulty;
  waypoints: RouteWaypoint[];
  stops: RouteStop[];
  warnings: LocalizedText[];
  lastReviewed: string;
}

export interface Restaurant {
  slug: string;
  name: string;
  category:
    | 'cordero-patagonico'
    | 'centolla'
    | 'merluza-austral'
    | 'chupe-de-centolla'
    | 'calafate-sour'
    | 'cafeteria'
    | 'comida-rapida'
    | 'restaurante-familiar'
    | 'restaurante-premium';
  city: string;
  description: LocalizedText;
  googleMapsUrl: string;
  phone: string | null;
  website: string | null;
  sourceNote: LocalizedText;
  lastReviewed: string;
}

export interface Accommodation {
  slug: string;
  name: string;
  type: 'hotel' | 'hostal' | 'cabana' | 'departamento' | 'camping';
  city: 'Punta Arenas' | 'Puerto Natales' | 'Torres del Paine';
  priceRange: 'economico' | 'medio' | 'alto' | 'consultar';
  parking: boolean;
  breakfast: boolean;
  accessible: boolean;
  familyFriendly: boolean;
  petsAllowed: boolean;
  googleMapsUrl: string;
  website: string | null;
  sourceNote: LocalizedText;
  lastReviewed: string;
}

export interface OfficialLink {
  title: LocalizedText;
  description: LocalizedText;
  url: string;
  source: string;
  lastReviewed: string;
}

export interface SafetyTip {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  icon: string;
}

export interface Alert {
  id: string;
  active: boolean;
  severity: 'info' | 'warning' | 'critical';
  message: LocalizedText;
  date: string;
}

export interface CompanyConfig {
  name: string;
  slogan: string;
  website: string;
  whatsappAsistencia: string;
  whatsappReservas: string;
  correoReservas: string;
  direccionEmpresa: string;
  instagramEmpresa: string;
  services: LocalizedText[];
}

export interface TripPlan {
  id: string;
  origin: string;
  destination: string;
  days: number;
  passengers: number;
  tripType: TripType;
  approxDate: string;
  crossingToArgentina: boolean;
  vehicleType: string;
  createdAt: string;
}
