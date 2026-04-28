import { trophyService } from '../services/trophy.service';
import type { Trophy } from '../types';

export interface TrophyDetailsDTO extends Trophy {
  formattedDate: string;
  hasLocation: boolean;
}

export const getTrophyDetailsUseCase = async (id: string) => {
  const trophy = await trophyService.getById(id);
  if (!trophy) return null;

  return {
    ...trophy,
    formattedDate: new Date(trophy.createdAt).toLocaleString('ru-RU', {
       day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }),
    // Удобный флаг для UI
    hasLocation: !!(trophy.location && trophy.location.lat && trophy.location.lng)
  };
};