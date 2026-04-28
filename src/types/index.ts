export interface TrophyPhoto {
  url: string;
  storagePath: string; // Понадобится для удаления файла
  width: number;
  height: number;
  metadata?: {
    lat?: number;
    lng?: number;
    takenAt?: number;
    device?: string;
  };
}

export interface Trophy {
  id: string;
  plateNumber: string;
  mainImageUrl: string; // Дублируем первое фото для быстрой загрузки ленты
  photos: TrophyPhoto[]; // Массив всех фото
  createdAt: number;
  userId: string;
  number: number;
  region: number;
  isNotFormat: boolean;
  numberNotFormat?: string;
  location?: {
    lat: number;
    lng: number;
  };
  authorName: string;
  authorPhoto: string | null;
}