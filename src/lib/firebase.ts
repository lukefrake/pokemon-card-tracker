import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase initialized with project:', app.options.projectId);
const db = getFirestore(app);

export interface CollectionData {
  profileName: string | null;
  collection: Record<string, boolean>;
  lastUpdated: number;
}

// Function to get the current user's collection
export async function getUserCollection(profileName: string): Promise<CollectionData | null> {
  try {
    const docRef = doc(db, 'collections', profileName);
    const docSnap = await getDoc(docRef);
    
    console.log('Fetching collection for profile:', profileName);
    if (docSnap.exists()) {
      console.log('Found collection with data:', docSnap.data());
      return docSnap.data() as CollectionData;
    }
    console.log('No collection found for profile');
    return null;
  } catch (error) {
    console.error('Error getting collection:', error);
    return null;
  }
}

// Function to save the user's collection
export async function saveUserCollection(profileName: string, data: CollectionData): Promise<void> {
  try {
    console.log('Starting save operation for profile:', profileName);
    console.log('Data to save:', JSON.stringify(data, null, 2));
    
    const docRef = doc(db, 'collections', profileName);
    console.log('Document reference created');
    
    const saveData = {
      ...data,
      lastUpdated: Date.now()
    };
    console.log('Prepared data for save:', saveData);
    
    await setDoc(docRef, saveData);
    console.log('Collection saved successfully');
  } catch (error: any) {
    console.error('Detailed save error:', {
      message: error?.message || 'Unknown error',
      code: error?.code || 'UNKNOWN',
      stack: error?.stack || 'No stack trace'
    });
    throw error;
  }
}

export { db }; 