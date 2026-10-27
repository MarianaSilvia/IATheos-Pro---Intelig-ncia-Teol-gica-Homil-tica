/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import firebaseConfigData from '../../firebase-applet-config.json';

const firebaseConfig = {
  projectId: firebaseConfigData.projectId,
  appId: firebaseConfigData.appId,
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  measurementId: firebaseConfigData.measurementId,
};

// Initialize App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with custom database ID if present
export const db = firebaseConfigData.firestoreDatabaseId
  ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Error Context Handler conforming to FirestoreErrorInfo
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operation: OperationType;
  path: string;
  authInfo: {
    userId?: string;
    email?: string;
    emailVerified?: boolean;
    isAdmin?: boolean;
  };
}

export function handleFirestoreError(
  error: any,
  operation: OperationType,
  path: string,
  currentUser?: User | null
): never {
  const isPermissionError =
    error?.code === 'permission-denied' ||
    (typeof error?.message === 'string' && error.message.toLowerCase().includes('permission'));

  if (isPermissionError) {
    const errorInfo: FirestoreErrorInfo = {
      error: error.message || 'Missing or insufficient permissions.',
      operation,
      path,
      authInfo: {
        userId: currentUser?.uid,
        email: currentUser?.email || undefined,
        emailVerified: currentUser?.emailVerified || false,
        isAdmin: currentUser?.email === 'marianabsilva1987@gmail.com',
      },
    };
    throw new Error(JSON.stringify(errorInfo));
  }
  throw error;
}

// Connection test
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client appears to be offline or initializing.');
      return false;
    }
    // permission-denied on nonexistent test doc is normal and means server responded
    return true;
  }
}

// Execute connection test on boot
if (typeof window !== 'undefined') {
  testFirestoreConnection().catch((err) => console.log('Firestore init status:', err?.message));
}
