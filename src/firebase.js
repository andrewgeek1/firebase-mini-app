import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase подключается здесь.
// Значения берутся из файла .env, чтобы не хранить настройки прямо в коде.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value || String(value).startsWith('your_'))
  .map(([key]) => key);

if (missingKeys.length > 0) {
  console.warn('Firebase config is incomplete:', missingKeys);
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
