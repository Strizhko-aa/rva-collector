import { updateProfile } from 'firebase/auth';
import { storageService } from '../services/storage.service';
import { auth } from '../services/firebase';
import { adminService } from '../services/admin.service';

export const updateProfileUseCase = async (file: File) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Пользователь не авторизован");

  // 1. Грузим в Cloudinary
  const imageUrl = await storageService.uploadMultiple([file]);
  const newPhotoURL = imageUrl[0];
  
  // 2. Обновляем Firebase Auth
  await updateProfile(user, { photoURL: newPhotoURL });

  // 3. АВТО-СИНХРОНИЗАЦИЯ (вот наш "костыль" в действии)
  const displayName = user.displayName || user.email?.split('@')[0] || 'Охотник';
  await adminService.syncUserTrophies(user.uid, newPhotoURL, displayName);

  return newPhotoURL;
};