import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, Firestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Debug Firebase configuration
console.log('[Firebase Config]', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId,
  hasStorageBucket: !!firebaseConfig.storageBucket,
  hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
  hasAppId: !!firebaseConfig.appId,
  environment: process.env.NODE_ENV,
  isClient: typeof window !== 'undefined'
});

let app;
let db: Firestore;

// Initialize Firebase
try {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error('Missing required Firebase configuration. Check environment variables.');
  }

  app = initializeApp(firebaseConfig);
  console.log('[Firebase] Initialized with project:', app.options.projectId);
  
  db = getFirestore(app);
  console.log('[Firebase] Firestore initialized');
} catch (error) {
  console.error('[Firebase] Initialization error:', error);
  throw error;
}

export interface CollectionData {
  profileName: string | null;
  collection: Record<string, boolean>;
  lastUpdated: number;
}

// Function to get the current user's collection
export async function getUserCollection(profileName: string): Promise<CollectionData | null> {
  try {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    
    console.log('[Firebase] Getting collection for profile:', profileName);
    const docRef = doc(db, 'collections', profileName);
    console.log('[Firebase] Document reference created for:', docRef.path);
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
    console.error('[Firebase] Error getting collection:', {
      error,
      profileName,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

// Function to save the user's collection
export async function saveUserCollection(profileName: string, data: CollectionData): Promise<void> {
  try {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    
    console.log('[Firebase] Saving collection:', {
      profileName,
      cardCount: Object.keys(data.collection).length,
      lastUpdated: new Date(data.lastUpdated).toISOString()
    });
    
    const docRef = doc(db, 'collections', profileName);
    console.log('[Firebase] Document reference created for:', docRef.path);
    
    await setDoc(docRef, data);
    console.log('[Firebase] Collection saved successfully');
  } catch (error) {
    console.error('[Firebase] Save error:', {
      error,
      profileName,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

export { db }; 