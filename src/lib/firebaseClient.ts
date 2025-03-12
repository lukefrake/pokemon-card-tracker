'use client';

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, Firestore } from 'firebase/firestore';

let app;
let db: Firestore | null = null;

export function initializeFirebase() {
  if (db) {
    return { db };
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
    console.log('[Firebase] Firestore connected');

    return { db };
  } catch (error) {
    console.error('[Firebase] Initialization error:', error);
    throw error;
  }
}

export interface CollectionData {
  profileName: string | null;
  collection: Record<string, boolean>;
  lastUpdated: number;
}

export async function getUserCollection(profileName: string): Promise<CollectionData | null> {
  const { db } = initializeFirebase();
  
  try {
    console.log('[Firebase] Getting collection for profile:', profileName);
    const docRef = doc(db, 'collections', profileName);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as CollectionData;
      console.log('[Firebase] Found collection:', {
        profileName: data.profileName,
        cardCount: Object.keys(data.collection).length,
        lastUpdated: new Date(data.lastUpdated).toISOString()
      });
      return data;
    }
    console.log('[Firebase] No collection found for profile:', profileName);
    return null;
  } catch (error) {
    console.error('[Firebase] Error getting collection:', error);
    throw error;
  }
}

export async function saveUserCollection(profileName: string, data: CollectionData): Promise<void> {
  const { db } = initializeFirebase();
  
  try {
    console.log('[Firebase] Saving collection:', {
      profileName,
      cardCount: Object.keys(data.collection).length,
      lastUpdated: new Date(data.lastUpdated).toISOString()
    });
    
    const docRef = doc(db, 'collections', profileName);
    await setDoc(docRef, data);
    console.log('[Firebase] Collection saved successfully');
  } catch (error) {
    console.error('[Firebase] Save error:', error);
    throw error;
  }
} 