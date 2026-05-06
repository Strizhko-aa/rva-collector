import { useImperativeHandle, forwardRef, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

// Описываем методы, которые будут доступны снаружи через ref
export interface MapControllerHandle {
  flyToLocation: (lat: number, lng: number, zoom?: number) => void;
  fitAllPoints: (coords: [number, number][]) => void;
}

interface Props {
  points: [number, number][];
}

const MapController = forwardRef<MapControllerHandle, Props>(({ points }, ref) => {
  const map = useMap();

  // Внутренняя функция для расчета границ
  const performFitBounds = (coords: [number, number][]) => {
    if (coords.length === 0) return;
    const bounds = L.latLngBounds(coords);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
  };

  // ЭКСПОЗИТОР: Прокидываем методы в ref родителя
  useImperativeHandle(ref, () => ({
    flyToLocation: (lat, lng, zoom = 16) => {
      map.flyTo([lat, lng], zoom, { duration: 1.5 });
    },
    fitAllPoints: (coords) => {
      performFitBounds(coords);
    }
  }));

  // АВТО-ПОЗИЦИОНИРОВАНИЕ при инициализации данных (BBox)
  useEffect(() => {
    if (points.length > 0) {
      performFitBounds(points);
    }
  }, [points]); // Сработает, когда массив точек загрузится или изменится

  return null; // Компонент ничего не рендерит, он только управляет
});

export default MapController;