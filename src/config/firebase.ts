// This file is populated with environment variables during build
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''
} as const;

// Validate configuration
const requiredKeys = ['apiKey', 'projectId'] as const;
for (const key of requiredKeys) {
  if (!firebaseConfig[key]) {
    console.error(`[Firebase Config] Missing required key: ${key}`);
  }
}

export function getFirebaseConfig() {
  return {
    ...firebaseConfig,
    _debugInfo: {
      environment: process.env.NODE_ENV,
      buildTime: process.env.NEXT_PUBLIC_BUILD_TIME || 'unknown',
      hasConfig: Object.entries(firebaseConfig).reduce((acc, [key, value]) => {
        acc[key] = !!value;
        return acc;
      }, {} as Record<string, boolean>)
    }
  };
} 