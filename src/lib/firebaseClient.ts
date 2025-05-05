'use client';

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  Firestore 
} from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth';

let app;
let db: Firestore | null = null;
let auth: Auth | null = null;

export function initializeFirebase() {
  if (db) {
    return { db, auth };
  }

  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
  };

  try {
    console.log('[Firebase] Initializing with config:', {
      hasApiKey: !!firebaseConfig.apiKey,
      hasProjectId: !!firebaseConfig.projectId,
      env: process.env.NODE_ENV,
      envVars: {
        apiKey: process.env.FIREBASE_API_KEY ? 'set' : 'not set',
        projectId: process.env.FIREBASE_PROJECT_ID ? 'set' : 'not set'
      }
    });

    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      throw new Error('Firebase configuration is incomplete');
    }

    app = initializeApp(firebaseConfig);
    console.log('[Firebase] App initialized');
    
    db = getFirestore(app);
    auth = getAuth(app);
    console.log('[Firebase] Firestore and Auth initialized');

    return { db, auth };
  } catch (error) {
    console.error('[Firebase] Initialization error:', error);
    throw error;
  }
}

export interface CollectionData {
  collection: Record<string, boolean>;
  lastUpdated: number;
}

export async function getUserCollection(userId: string): Promise<CollectionData | null> {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    const docRef = doc(db, 'collections', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as CollectionData;
    }
    return null;
  } catch (error) {
    console.error('[Firebase] Error getting collection:', error);
    throw error;
  }
}

export async function saveUserCollection(userId: string, data: CollectionData): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');
  
  try {
    const docRef = doc(db, 'collections', userId);
    await setDoc(docRef, data);
  } catch (error) {
    console.error('[Firebase] Error saving collection:', error);
    throw error;
  }
}

// Authentication functions
export async function signUp(email: string, password: string): Promise<User> {
  if (!auth) throw new Error('Auth not initialized');
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('[Firebase] Error signing up:', error);
    throw error;
  }
}

export async function signIn(email: string, password: string): Promise<User> {
  if (!auth) throw new Error('Auth not initialized');
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('[Firebase] Error signing in:', error);
    throw error;
  }
}

export async function logOut(): Promise<void> {
  if (!auth) throw new Error('Auth not initialized');
  
  try {
    await signOut(auth);
  } catch (error) {
    console.error('[Firebase] Error signing out:', error);
    throw error;
  }
}

export function onAuthStateChange(callback: (user: User | null) => void): () => void {
  if (!auth) throw new Error('Auth not initialized');
  return onAuthStateChanged(auth, callback);
} 