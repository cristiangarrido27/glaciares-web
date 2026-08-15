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
  shortDescription: string;
  image: string;
  imageAlt: string;
  placeholderImage: boolean;
  distanceFromPuntaArenasKm: number | null;
  approxDrivingTime: string;
  roadType: RoadType;
  bestSeason: string;
  fuelAvailable: boolean;
  difficulty: Difficulty;
  recommendedVehicle: string;
  googleMapsUrl: string;
  routeSlug: string | null;
  tripTypes: TripType[];
  lastReviewed: string;
}

export interface RouteStop {
  name: string;
  type: 'mirador' | 'restaurante' | 'baño' | 'combustible' | 'atractivo' | 'frontera';
  note: string;
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
  summary: string;
  durationLabel: string;
  distanceKm: number | null;
  drivingTime: string;
  suggestedDeparture: string;
  bordersInvolved: string[];
  roadType: RoadType;
  difficulty: Difficulty;
  waypoints: RouteWaypoint[];
  stops: RouteStop[];
  warnings: string[];
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
  description: string;
  googleMapsUrl: string;
  phone: string | null;
  website: string | null;
  sourceNote: string;
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
  sourceNote: string;
  lastReviewed: string;
}

export interface OfficialLink {
  title: string;
  description: string;
  url: string;
  source: string;
  lastReviewed: string;
}

export interface SafetyTip {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export interface Alert {
  id: string;
  active: boolean;
  severity: 'info' | 'warning' | 'critical';
  message: string;
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
  services: string[];
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
