import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCiBO_ccwzmJHwVIhZdRv2DDJWuUWqoHwc",
  authDomain: "rva-collector.firebaseapp.com",
  projectId: "rva-collector",
  storageBucket: "rva-collector.firebasestorage.app",
  messagingSenderId: "155111678067",
  appId: "1:155111678067:web:7f3fe244bcb46e420c8a06"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// rX5ZbzneTFuLYzgoQbIGKBUXVak