import { useEffect } from 'react';
import { MapContainer, Marker, ScaleControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-plugins/layer/tile/Yandex.js';

// Исправляем иконки
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Patch Yandex layer cleanup to avoid Leaflet/Yandex race conditions.
// The plugin can delete its container before Leaflet's own remove handler runs,
// which causes `this._container.remove()` to fail during unmount.
const yandexProto = (L.Yandex?.prototype as any);
if (yandexProto && yandexProto._destroy) {
  const originalDestroy = yandexProto._destroy;
  yandexProto._destroy = function (e: any) {
    if (!this._map || this._map === e.target) {
      if (this._yandex) {
        this._yandex.destroy();
        delete this._yandex;
      }
      if (!this._container) {
        this._container = { remove: () => {} };
      }
      // Preserve container reference so Leaflet's remove callback can safely use it.
    } else {
      originalDestroy.call(this, e);
    }
  };
}

interface Props {
  location: { lat: number; lng: number };
}

/**
 * Внутренний компонент для управления слоями через хук useMap
 */
const YandexMapLayer = () => {
  const map = useMap();

  useEffect(() => {
    // 1. Создаем слой
    const layer = new L.Yandex('map', {
      maxZoom: 18,
      attribution: '&copy; Яндекс'
    });

    layer.addTo(map);

    return () => {
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    };
  }, [map]);

  return null;
};

const TrophyMapView = ({ location }: Props) => {
  return (
    <div className="w-full h-full rounded-3xl overflow-hidden border border-gray-100 shadow-inner">
      <MapContainer 
        center={location} 
        zoom={16} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        {/* Активируем слой Яндекса */}
        <YandexMapLayer />
        
        <Marker position={location} icon={DefaultIcon} />
        <ScaleControl position="bottomleft" imperial={false} />
      </MapContainer>
    </div>
  );
};

export default TrophyMapView;