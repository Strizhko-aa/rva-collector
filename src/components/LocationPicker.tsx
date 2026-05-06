import { useEffect } from 'react';
import { MapContainer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-plugins/layer/tile/Yandex.js';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Компонент для автоматического перемещения карты к маркеру
const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    // Используем setView или flyTo, чтобы карта плавно или мгновенно сдвинулась к новым координатам
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const YandexMapLayer = () => {
  const map = useMap();
  useEffect(() => {
    const layer = new L.Yandex('map', {
      maxZoom: 18,
      attribution: '&copy; Яндекс'
    });
    layer.addTo(map);
    return () => {
      if (map.hasLayer(layer)) map.removeLayer(layer);
    };
  }, [map]);
  return null;
};

const MapEventsHandler = ({ onClick }: { onClick: (latlng: L.LatLng) => void }) => {
  useMapEvents({
    click(e) { onClick(e.latlng); },
  });
  return null;
};

interface LocationPickerProps {
  location: { lat: number; lng: number };
  onChange: (location: { lat: number; lng: number }) => void;
}

const LocationPicker = ({ location, onChange }: LocationPickerProps) => {
  const centerPos: [number, number] = [location.lat, location.lng];

  return (
    <div className="w-full h-[300px] rounded-3xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-inner relative">
      <MapContainer 
        center={centerPos} 
        zoom={16} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        {/* Это заставит карту центрироваться при изменении location */}
        <ChangeView center={centerPos} />
        
        <YandexMapLayer />
        <MapEventsHandler onClick={(latlng) => onChange({ lat: latlng.lat, lng: latlng.lng })} />
        <Marker position={centerPos} icon={DefaultIcon} />
      </MapContainer>
    </div>
  );
};

export default LocationPicker;