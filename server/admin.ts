import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function app() {
  const existing = getApps().find(a => a.name === 'dlss-business');
  if (existing) return existing;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error('FIREBASE_PROJECT_ID is required');
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  return initializeApp({ projectId, credential: serviceAccount ? cert(JSON.parse(serviceAccount)) : applicationDefault() }, 'dlss-business');
}
export function database() {
  if (!process.env.FIREBASE_DATABASE_ID) throw new Error('Named FIREBASE_DATABASE_ID is required');
  return getFirestore(app(), process.env.FIREBASE_DATABASE_ID);
}
export const adminAuth = () => getAuth(app());
