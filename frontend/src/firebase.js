import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBxsLRoR_7obGhweEWhaW43XVNH9PMYJfA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "tenis-isturgi.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "tenis-isturgi",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "tenis-isturgi.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "707348941864",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:707348941864:web:d54fcecfb0677a6851791d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
