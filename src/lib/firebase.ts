import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Firestore with offline support and error handling
let db: any;
try {
  db = initializeFirestore(app, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    ignoreUndefinedProperties: true
  });
} catch (error) {
  console.warn('Failed to initialize Firestore with advanced settings, using default:', error);
  db = getFirestore(app);
}

export { db };

// Flag to track if we're in development mode
export const isDevelopmentMode = import.meta.env.DEV;

// Development mode flag for Firestore operations
export const useLocalStorage = isDevelopmentMode;

// Suppress Firebase logging in development
if (isDevelopmentMode) {
  // Set Firebase log level to silent in development
  import('firebase/app').then(({ setLogLevel }) => {
    try {
      setLogLevel('silent');
    } catch (error) {
      console.warn('Could not set Firebase log level:', error);
    }
  });
}

export default app;