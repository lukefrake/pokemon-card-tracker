// This configuration is populated at build time and embedded in the client bundle
const buildConfig = {
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  },
  buildTime: process.env.NEXT_PUBLIC_BUILD_TIME,
  commitSha: process.env.NEXT_PUBLIC_COMMIT_SHA,
  environment: process.env.NODE_ENV
} as const;

// Export the configuration
export const firebaseConfig = buildConfig.firebase;

// Debug configuration at runtime
if (typeof window !== 'undefined') {
  console.log('[Firebase Config]', {
    hasConfig: Object.entries(firebaseConfig).reduce((acc, [key, value]) => {
      acc[key] = !!value;
      return acc;
    }, {} as Record<string, boolean>),
    buildInfo: {
      time: buildConfig.buildTime,
      commit: buildConfig.commitSha,
      env: buildConfig.environment
    }
  });
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