import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

// Фикс иконок
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
  onChange: (pos: { lat: number; lng: number }) => void;
}

// Компонент для обновления центра карты при изменении location извне (EXIF)
const RecenterMap = ({ location }: { location: { lat: number; lng: number } }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([location.lat, location.lng], map.getZoom());
  }, [location, map]);
  return null;
};

const LocationMarker = ({ location, onChange }: Props) => {
  useMapEvents({
    click(e) {
      onChange(e.latlng);
    },
  });
  return <Marker position={location} icon={DefaultIcon} />;
};

const LocationPicker = ({ location, onChange }: Props) => {
  return (
    <div className="w-full rounded-xl overflow-hidden border border-gray-200 shadow-inner" style={{ height: '300px' }}>
      <MapContainer 
        center={location} 
        zoom={13} 
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }} // Жестко задаем высоту здесь
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />
        <LocationMarker location={location} onChange={onChange} />
        <RecenterMap location={location} />
      </MapContainer>
    </div>
  );
};

export default LocationPicker;