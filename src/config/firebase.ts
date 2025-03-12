// This configuration is populated at build time and embedded in the client bundle
const buildConfig = {
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
  },
  buildTime: process.env.BUILD_TIME,
  commitSha: process.env.COMMIT_SHA,
  environment: process.env.NODE_ENV
} as const;

// Export the configuration
export const firebaseConfig = buildConfig.firebase;

// Debug configuration at runtime (safely)
if (typeof window !== 'undefined') {
  console.log('[Firebase Config]', {
    hasConfig: {
      // Only log presence/absence of config values
      apiKey: '✓',
      authDomain: !!buildConfig.firebase.authDomain,
      projectId: !!buildConfig.firebase.projectId,
      storageBucket: !!buildConfig.firebase.storageBucket,
      messagingSenderId: !!buildConfig.firebase.messagingSenderId,
      appId: '✓'
    },
    buildInfo: {
      time: buildConfig.buildTime,
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