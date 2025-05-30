import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, Firestore } from 'firebase/firestore';
import getConfig from 'next/config';

console.log('[Firebase] Module Load');

// Get runtime config
const { publicRuntimeConfig } = getConfig() || {};

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Debug configuration at runtime
if (typeof window !== 'undefined') {
  // Log the raw config (safely)
  console.log('[Firebase] Raw Config Check:', {
    apiKey: firebaseConfig.apiKey ? '✓' : '✗',
    authDomain: firebaseConfig.authDomain ? '✓' : '✗',
    projectId: firebaseConfig.projectId ? '✓' : '✗',
    storageBucket: firebaseConfig.storageBucket ? '✓' : '✗',
    messagingSenderId: firebaseConfig.messagingSenderId ? '✓' : '✗',
    appId: firebaseConfig.appId ? '✓' : '✗'
  });

  // Log environment info
  console.log('[Firebase] Environment:', {
    nodeEnv: process.env.NODE_ENV,
    basePath: process.env.NEXT_PUBLIC_BASE_PATH,
    buildTime: new Date().toISOString(),
    window: {
      location: window.location.href,
      hostname: window.location.hostname
    },
    publicRuntimeConfig: publicRuntimeConfig ? {
      hasConfig: Object.keys(publicRuntimeConfig).length > 0,
      keys: Object.keys(publicRuntimeConfig)
    } : 'no config'
  });
}

// Initialize Firebase
console.log('[Firebase] Initializing with config:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasProjectId: !!firebaseConfig.projectId,
  env: process.env.NODE_ENV,
  publicRuntimeConfig: publicRuntimeConfig ? {
    hasConfig: Object.keys(publicRuntimeConfig).length > 0,
    keys: Object.keys(publicRuntimeConfig)
  } : 'no config'
});

let app;
let db: Firestore;

try {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('[Firebase] Missing required config:', {
      hasApiKey: !!firebaseConfig.apiKey,
      hasProjectId: !!firebaseConfig.projectId,
      env: process.env.NODE_ENV,
      publicRuntimeConfig: publicRuntimeConfig ? {
        hasConfig: Object.keys(publicRuntimeConfig).length > 0,
        keys: Object.keys(publicRuntimeConfig)
      } : 'no config'
    });
    throw new Error('Firebase configuration is incomplete');
  }

  app = initializeApp(firebaseConfig);
  console.log('[Firebase] Initialized successfully');
  
  db = getFirestore(app);
  console.log('[Firebase] Connected to Firestore');
} catch (error) {
  console.error('[Firebase] Initialization error:', {
    error,
    config: {
      hasApiKey: !!firebaseConfig.apiKey,
      hasProjectId: !!firebaseConfig.projectId
    },
    env: process.env.NODE_ENV,
    publicRuntimeConfig: publicRuntimeConfig ? {
      hasConfig: Object.keys(publicRuntimeConfig).length > 0,
      keys: Object.keys(publicRuntimeConfig)
    } : 'no config'
  });
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