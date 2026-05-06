import { trophyService } from '../services/trophy.service';
import type { Trophy } from '../types';

export interface TrophyDetailsDTO extends Omit<Trophy, 'id'> {
  id: string;
  // Мы убираем одиночные поля даты и автора, так как они теперь внутри observations
}

export const getTrophyDetailsUseCase = async (id: string): Promise<TrophyDetailsDTO | null> => {
  const trophy = await trophyService.getById(id);
  if (!trophy) return null;
  return trophy;
};