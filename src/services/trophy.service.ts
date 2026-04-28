import { 
  collection, 
  addDoc, 
  getDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import type { Trophy } from '../types';

const COLLECTION_NAME = 'trophies';

export const trophyService = {
  // Добавление нового трофея
  async add(trophyData: Omit<Trophy, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), trophyData);
    return docRef.id;
  },

  // Получение одного трофея по ID
  async getById(id: string): Promise<Trophy | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Trophy;
    }
    return null;
  },

  // Подписка на ленту (Real-time)
  subscribeToFeed(callback: (trophies: Trophy[]) => void) {
    const q = query(
      collection(db, COLLECTION_NAME), 
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const trophies = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Trophy[];
      callback(trophies);
    });
  }
};