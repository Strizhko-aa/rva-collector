// src/types/leaflet-plugins.d.ts
import 'leaflet';

declare module 'leaflet' {
  namespace Yandex {
    interface Options extends TileLayerOptions {
      // Тип карты Яндекса. Например: 'map', 'satellite', 'hybrid'
      type?: 'map' | 'satellite' | 'hybrid' | 'traffic'; 
      // Можно добавить API ключ, если он есть
      key?: string; 
      minZoom?: number;
      maxZoom?: number;
    }
  }

  class Yandex extends TileLayer {
    constructor(type?: 'map' | 'satellite' | 'hybrid' | 'traffic', options?: Yandex.Options);
  }
}