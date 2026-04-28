import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Фикс иконок (как в прошлый раз)
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

interface Props {
  location: { lat: number; lng: number };
}

const StaticLocationView = ({ location }: Props) => {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm" style={{ height: '200px' }}>
      <MapContainer 
        center={location} 
        zoom={15} 
        scrollWheelZoom={false}
        zoomControl={false} // Отключаем кнопки зума для красоты
        dragging={false}    // Отключаем перетаскивание, это просто вьювер
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={location} icon={DefaultIcon} />
      </MapContainer>
    </div>
  );
};

export default StaticLocationView;