import { db } from './firebase';
import { collection, query, where, getDocs, writeBatch } from 'firebase/firestore';

export const adminService = {
  // Массовое обновление данных автора во всех его трофеях
  async syncUserTrophies(userId: string, newPhoto: string | null, newName: string) {
    const trophiesRef = collection(db, 'trophies');
    const q = query(trophiesRef, where('userId', '==', userId));
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return 0;

    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
      batch.update(doc.ref, {
        authorPhoto: newPhoto,
        authorName: newName
      });
    });

    await batch.commit();
    return querySnapshot.size;
  }
};