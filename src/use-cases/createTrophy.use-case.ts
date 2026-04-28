// src/use-cases/createTrophy.use-case.ts
import { storageService } from '../services/storage.service';
import { trophyService } from '../services/trophy.service';
import type { Trophy } from '../types';
import { auth } from '../services/firebase';

export interface CreateTrophyDTO {
  number: string;
  region: string;
  numberNotFormat: string;
  isNotFormat: boolean;
  imageFiles: File[];
  userId: string;
  location: { lat: number; lng: number } | null;
  capturedAt: number | null;
}

export const createTrophyUseCase = async (data: CreateTrophyDTO): Promise<string> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Не авторизован");

  // 1. Загрузка фото (Слой Storage)
  const urls = await storageService.uploadMultiple(data.imageFiles);

  // 2. Бизнес-логика подготовки данных
  const plateNumber = data.isNotFormat 
    ? data.numberNotFormat 
    : `${data.number}${data.region}`;

  // ИСПРАВЛЕНИЕ: строго null вместо undefined, если локации нет
  const cleanLocation = (data.location && typeof data.location.lat === 'number') 
    ? { lat: data.location.lat, lng: data.location.lng } 
    : null;

  const newTrophy: Omit<Trophy, 'id'> = {
    plateNumber,
    mainImageUrl: urls[0],
    photos: urls.map(url => ({ 
      url, 
      storagePath: 'cloudinary', 
      width: 0, 
      height: 0 
    })),
    createdAt: data.capturedAt || Date.now(),
    userId: data.userId,
    number: data.isNotFormat ? 0 : Number(data.number),
    region: data.isNotFormat ? 0 : Number(data.region),
    isNotFormat: data.isNotFormat,
    numberNotFormat: data.isNotFormat ? data.numberNotFormat : "",
    location: cleanLocation, // Теперь сюда попадет либо чистый объект, либо null
    authorName: user.displayName || user.email?.split('@')[0] || 'Охотник без имени',
    authorPhoto: user.photoURL || null,
  };

  // 3. Сохранение (Слой БД)
  // ХАК ДЛЯ FIRESTORE: JSON.parse(JSON.stringify) удаляет ЛЮБЫЕ поля, которые 
  // случайно оказались undefined (Firebase падает от undefined, но любит null).
  const finalData = JSON.parse(JSON.stringify(newTrophy));

  return await trophyService.add(finalData);
};