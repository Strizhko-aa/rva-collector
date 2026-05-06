// src/use-cases/createTrophy.use-case.ts
import { storageService } from '../services/storage.service';
import { trophyService } from '../services/trophy.service';
import type { Observation, Trophy } from '../types';
import { auth, db } from '../services/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

export interface CreateTrophyDTO {
  number: string;
  region: string;
  numberNotFormat: string;
  isNotFormat: boolean;
  imageFiles: File[];
  userId: string;
  location: { lat: number; lng: number } | null;
  capturedAt: number | null;
  onProgress?: (percent: number) => void; // Новый коллбэк
}

export const createTrophyUseCase = async (data: CreateTrophyDTO): Promise<string> => {

  const user = auth.currentUser;
  if (!user) throw new Error("Не авторизован");

  // 1. Загружаем все переданные файлы
  // 1. Загрузка фото (0% -> 90%)
  // Передаем коллбэк в сервис. Если сервис не поддерживает пофайловый прогресс, 
  // имитируем его для красоты или считаем по количеству файлов.
  const urls = await storageService.uploadMultiple(
    data.imageFiles,
    (p) => {
      if (data.onProgress) data.onProgress(Math.round(p * 0.9)); 
    }
  );

  if (data.onProgress) data.onProgress(90);

  const plateNumber = data.isNotFormat 
    ? data.numberNotFormat 
    : `${data.number}_${data.region}`;

  // 2. Формируем массив новых наблюдений
  const newObservations: Observation[] = urls.map(url => ({
    url,
    lat: data.location?.lat ?? null,
    lng: data.location?.lng ?? null,
    capturedAt: data.capturedAt || Date.now(),
    authorId: user.uid,
    authorName: user.displayName || user.email?.split('@')[0] || 'Охотник',
    authorPhoto: user.photoURL
  }));

  // 3. Проверяем, есть ли уже такой номер в базе
  const existingTrophy = await trophyService.getByPlateNumber(plateNumber);
  
  if (existingTrophy) {
    // ОБНОВЛЯЕМ: Добавляем новые фото в существующий номер
    const trophyRef = doc(db, 'trophies', existingTrophy.id);
    await updateDoc(trophyRef, {
      observations: arrayUnion(...newObservations),
      updatedAt: Date.now(),
      mainImageUrl: newObservations[0].url // Обновляем обложку на самое свежее фото
    });
    if (data.onProgress) data.onProgress(100);
    return existingTrophy.id;
  } else {
    // СОЗДАЕМ: Новый номер в коллекции
    const newTrophy: Omit<Trophy, 'id'> = {
      plateNumber,
      number: data.isNotFormat ? 0 : Number(data.number),
      region: data.isNotFormat ? 0 : Number(data.region),
      isNotFormat: data.isNotFormat,
      numberNotFormat: data.isNotFormat ? data.numberNotFormat : "",
      mainImageUrl: urls[0],
      observations: newObservations,
      createdAt: data.capturedAt || Date.now(),
      updatedAt: Date.now(),
    };
    if (data.onProgress) data.onProgress(100);
    return await trophyService.add(newTrophy);
  }

};