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

// Debug Firebase configuration
console.log('Firebase configuration:', {
  apiKey: firebaseConfig.apiKey ? 'Set' : 'Missing',
  authDomain: firebaseConfig.authDomain ? 'Set' : 'Missing',
  projectId: firebaseConfig.projectId ? 'Set' : 'Missing',
  storageBucket: firebaseConfig.storageBucket ? 'Set' : 'Missing',
  messagingSenderId: firebaseConfig.messagingSenderId ? 'Set' : 'Missing',
  appId: firebaseConfig.appId ? 'Set' : 'Missing'
});

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
    console.log('Getting collection for profile:', profileName);
    const docRef = doc(db, 'collections', profileName);
    console.log('Document reference created for:', docRef.path);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as CollectionData;
      console.log('Found collection with data:', {
        profileName: data.profileName,
        cardCount: Object.keys(data.collection).length,
        lastUpdated: new Date(data.lastUpdated).toISOString()
      });
      return data;
    }
    console.log('No collection found for profile:', profileName);
    return null;
  } catch (error) {
    console.error('Error getting collection:', error);
    throw error; // Re-throw to ensure errors are properly handled
  }
}

// Function to save the user's collection
export async function saveUserCollection(profileName: string, data: CollectionData): Promise<void> {
  try {
    console.log('Saving collection for profile:', profileName);
    console.log('Collection data:', {
      profileName: data.profileName,
      cardCount: Object.keys(data.collection).length,
      lastUpdated: new Date(data.lastUpdated).toISOString()
    });
    
    const docRef = doc(db, 'collections', profileName);
    console.log('Document reference created for:', docRef.path);
    
    await setDoc(docRef, data);
    console.log('Collection saved successfully to Firebase');
  } catch (error: any) {
    console.error('Firebase save error:', {
      message: error?.message || 'Unknown error',
      code: error?.code || 'UNKNOWN',
      stack: error?.stack || 'No stack trace'
    });
    throw error;
  }
}

export { db }; 