// firebaseConfig.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCG0bpP9RpOYxDQMEPD8OGMN-YYb8v2GvI',
  authDomain: 'smit-c92d9.firebaseapp.com',
  projectId: 'smit-c92d9',
  storageBucket: 'smit-c92d9.appspot.com',
  messagingSenderId: '142299570814',
  appId: '1:142299570814:web:b65c80becb02d9c13c2e2f',
};

// Initialize Firebase app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Export Firebase services for use in other files
export { db, auth, storage };
