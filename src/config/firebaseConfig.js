import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCG0bpP9RpOYxDQMEPD8OGMN-YYb8v2GvI',
  authDomain: 'smit-c92d9.firebaseapp.com',
  projectId: 'smit-c92d9',
  storageBucket: 'smit-c92d9.appspot.com',
  messagingSenderId: '142299570814',
  appId: '1:142299570814:web:b65c80becb02d9c13c2e2f',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
