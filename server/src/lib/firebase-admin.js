import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
// In production, you would use a service account key file
// For development, we'll use the Firebase project ID and rely on default credentials
const initializeFirebaseAdmin = () => {
  try {
    if (!admin.apps.length) {
      // For development, you can use the Firebase project ID from environment
      // In production, use a service account key file
      const projectId = process.env.FIREBASE_PROJECT_ID || 'tic-tac-toe-ff1c7';
      
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        // Production: Use service account key
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: projectId
        });
      } else {
        // Development: Use project ID only (requires Firebase CLI auth)
        admin.initializeApp({
          projectId: projectId
        });
      }
      console.log('Firebase Admin initialized successfully');
    }
    return admin;
  } catch (error) {
    console.warn('Firebase Admin initialization failed:', error.message);
    return null;
  }
};

// Verify Firebase ID token
export const verifyFirebaseToken = async (idToken) => {
  try {
    const firebaseAdmin = initializeFirebaseAdmin();
    if (!firebaseAdmin) {
      throw new Error('Firebase Admin not initialized');
    }
    
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      name: decodedToken.name,
      picture: decodedToken.picture,
      provider: decodedToken.firebase.sign_in_provider
    };
  } catch (error) {
    throw new Error(`Firebase token verification failed: ${error.message}`);
  }
};

export const firebaseAdmin = initializeFirebaseAdmin();
export { initializeFirebaseAdmin };