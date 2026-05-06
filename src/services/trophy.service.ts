import { 
  collection, 
  addDoc, 
  getDoc, 
  getDocs,
  doc, 
  query, 
  orderBy, 
  onSnapshot,
  where
} from 'firebase/firestore';
import { db } from './firebase';
import type { Trophy } from '../types';

const COLLECTION_NAME = 'trophies';

interface trophyServiceInterface {
  add: (trophyData: Omit<Trophy, 'id'>) => Promise<string>;
  getById: (id: string) => Promise<Trophy | null>;
  subscribeToFeed: (callback: (trophies: Trophy[]) => void) => () => void; // Возвращает функцию отписки
  getByPlateNumber: (plateNumber: string) => Promise<Trophy | null>;
}

export const trophyService: trophyServiceInterface = {
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
  },

  // получить трофей по номеру и региону
  async getByPlateNumber(plateNumber: string): Promise<Trophy | null> {
    const q = query(collection(db, COLLECTION_NAME), where("plateNumber", "==", plateNumber));
    const docSnap = await getDocs(q);
    
    if (docSnap.size > 0) {
      const doc = docSnap.docs[0];
      return { id: doc.id, ...doc.data() } as Trophy;
    }
    return null;
  }
};