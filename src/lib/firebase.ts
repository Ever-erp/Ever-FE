// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// .env에서 값을 안전하게 불러오기
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env
    .VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string,
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firebase Storage 인스턴스 가져오기
export const storage = getStorage(app);
