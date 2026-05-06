export interface Observation {
  url: string;
  lat: number | null;
  lng: number | null;
  capturedAt: number;
  authorId: string;
  authorName: string;
  authorPhoto: string | null;
}

export interface Trophy {
  id: string;
  plateNumber: string; // Формат: "A111AA77" или "CUSTOM"
  number: number;      // 111 (для фильтрации)
  region: number;      // 77 (для фильтрации)
  isNotFormat: boolean;
  numberNotFormat: string;
  mainImageUrl: string; // Фото для обложки (обычно самое первое)
  observations: Observation[]; // Массив всех фиксаций этого номера
  createdAt: number;
  updatedAt: number;
}
