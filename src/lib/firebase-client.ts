import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, onSnapshot } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

/**
 * The only place the Firebase SDK is imported.
 *
 * Everything the app needs is imported by name and re-exported here rather than being imported
 * where it is used: a dynamic `import('firebase/auth')` hands the caller the whole module, so the
 * bundler has to keep every one of its exports, while these named imports let it drop what nobody
 * calls — 450 KB of SDK instead of 690 KB.
 */
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
const googleProvider = new GoogleAuthProvider();

export {
  auth,
  db,
  googleProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  doc,
  getDoc,
  onSnapshot,
};
