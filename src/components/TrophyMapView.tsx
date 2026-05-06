import { useEffect } from 'react';
import { MapContainer, Marker, ScaleControl, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-plugins/layer/tile/Yandex.js';
import type { Observation } from '../types';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// --- Твой патч для стабильности Яндекса ---
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
    } else {
      originalDestroy.call(this, e);
    }
  };
}

/**
 * КОМПОНЕНТ-КОНТРОЛЛЕР: "Полет" к выбранной точке
 */
const MapFlyTo = ({ target }: { target: { lat: number; lng: number } | null }) => {
  const map = useMap();

  useEffect(() => {
    if (target && target.lat && target.lng) {
      // flyTo делает плавную анимацию перемещения и зума
      map.flyTo([target.lat, target.lng], 16, {
        duration: 1.5, // длительность в секундах
        easeLinearity: 0.25
      });
    }
  }, [target, map]); // Срабатывает каждый раз, когда меняется target

  return null;
};

const YandexMapLayer = () => {
  const map = useMap();
  useEffect(() => {
    const layer = new L.Yandex('map', { maxZoom: 18, attribution: '&copy; Яндекс' });
    layer.addTo(map);
    return () => { if (map.hasLayer(layer)) map.removeLayer(layer); };
  }, [map]);
  return null;
};

interface Props {
  observations: Observation[];
  focusedLocation: { lat: number; lng: number } | null; // Новый пропс для слежения
}

const TrophyMapView = ({ observations, focusedLocation }: Props) => {
  const pointsWithGeo = observations.filter(o => o.lat !== null && o.lng !== null);
  
  // Если вообще нет точек с гео, карту не рисуем (или рисуем дефолт)
  if (pointsWithGeo.length === 0) return null;

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden border border-gray-100 shadow-inner relative">
      <MapContainer 
        center={[pointsWithGeo[0].lat!, pointsWithGeo[0].lng!]} 
        zoom={14} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <YandexMapLayer />
        
        {/* Активируем контроллер полета */}
        <MapFlyTo target={focusedLocation} />
        
        {pointsWithGeo.map((obs, idx) => (
          <Marker 
            key={idx} 
            position={[obs.lat!, obs.lng!]} 
            icon={DefaultIcon}
          >
            <Popup>
              <div className="text-xs font-bold p-1">
                <p>{obs.authorName}</p>
                <p className="text-gray-400 font-normal">{new Date(obs.capturedAt).toLocaleDateString()}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        <ScaleControl position="bottomleft" imperial={false} />
      </MapContainer>
    </div>
  );
};

export default TrophyMapView;