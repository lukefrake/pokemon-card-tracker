import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  // TODO: Replace with your Firebase config
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export interface CollectionData {
  profileName: string | null;
  collection: Record<string, boolean>;
  lastUpdated: number;
}

// Function to get the current user's collection
export async function getUserCollection(userId: string): Promise<CollectionData | null> {
  try {
    const docRef = doc(db, 'collections', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as CollectionData;
    }
    return null;
  } catch (error) {
    console.error('Error getting collection:', error);
    return null;
  }
}

// Function to save the user's collection
export async function saveUserCollection(userId: string, data: CollectionData): Promise<void> {
  try {
    const docRef = doc(db, 'collections', userId);
    await setDoc(docRef, {
      ...data,
      lastUpdated: Date.now()
    });
    console.log('Collection saved successfully');
  } catch (error) {
    console.error('Error saving collection:', error);
    throw error;
  }
}

// Function to initialize anonymous auth
export async function initializeAuth(): Promise<User> {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error('Error initializing auth:', error);
    throw error;
  }
}

// Function to listen to auth state changes
export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export { auth, db }; 