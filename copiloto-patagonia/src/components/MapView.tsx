import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapViewProps {
  waypoints: { name: string; coordinates: [number, number] }[];
  heightClass?: string;
}

export default function MapView({ waypoints, heightClass = 'h-80' }: MapViewProps) {
  if (waypoints.length === 0) return null;
  const center = waypoints[Math.floor(waypoints.length / 2)].coordinates;
  const line = waypoints.map((w) => w.coordinates);

  return (
    <div className={`${heightClass} w-full overflow-hidden rounded-2xl border border-slate-200`}>
      <MapContainer center={center} zoom={7} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={line} pathOptions={{ color: '#1677A6', weight: 4, dashArray: '6 8' }} />
        {waypoints.map((wp, idx) => (
          <Marker key={`${wp.name}-${idx}`} position={wp.coordinates} icon={defaultIcon}>
            <Popup>{wp.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
