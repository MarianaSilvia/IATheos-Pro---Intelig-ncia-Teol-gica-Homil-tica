/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  db,
  auth,
  handleFirestoreError,
  OperationType,
} from './firebase';
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { SermonOutline, EbdLesson, VerseXray } from '../utils/theology';
import { DigitalProduct } from '../utils/ecosystem';
import { PersonalNote } from '../utils/dashboard';

// Sync User Reading Progress
export async function saveReadingProgressToFirestore(
  userId: string,
  completedChapters: string[],
  streakDays: number = 7,
  currentDay: number = 42
): Promise<void> {
  const path = `reading_progress/${userId}`;
  try {
    await setDoc(
      doc(db, 'reading_progress', userId),
      {
        userId,
        completedChapters,
        streakDays,
        currentDay,
        lastUpdated: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path, auth.currentUser);
  }
}

export async function loadReadingProgressFromFirestore(
  userId: string
): Promise<string[] | null> {
  const path = `reading_progress/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'reading_progress', userId));
    if (snap.exists()) {
      const data = snap.data();
      if (Array.isArray(data.completedChapters)) {
        return data.completedChapters;
      }
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path, auth.currentUser);
  }
}

// Sync Saved Sermons
export async function saveSermonToFirestore(
  userId: string,
  sermon: SermonOutline
): Promise<void> {
  const path = `sermons/${sermon.id}`;
  try {
    await setDoc(doc(db, 'sermons', sermon.id), {
      ...sermon,
      userId,
      savedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path, auth.currentUser);
  }
}

export async function deleteSermonFromFirestore(sermonId: string): Promise<void> {
  const path = `sermons/${sermonId}`;
  try {
    await deleteDoc(doc(db, 'sermons', sermonId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path, auth.currentUser);
  }
}

// Sync Saved EBD Lessons
export async function saveEbdLessonToFirestore(
  userId: string,
  lesson: EbdLesson
): Promise<void> {
  const path = `ebd_lessons/${lesson.id}`;
  try {
    await setDoc(doc(db, 'ebd_lessons', lesson.id), {
      ...lesson,
      userId,
      savedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path, auth.currentUser);
  }
}

// Sync Saved Verse X-Rays
export async function saveVerseXrayToFirestore(
  userId: string,
  xray: VerseXray
): Promise<void> {
  const path = `verse_xrays/${xray.id}`;
  try {
    await setDoc(doc(db, 'verse_xrays', xray.id), {
      ...xray,
      userId,
      savedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path, auth.currentUser);
  }
}

// Sync User Profile
export async function saveUserProfile(
  userId: string,
  email: string,
  displayName: string,
  role: 'buyer' | 'admin',
  isProSubscriber: boolean
): Promise<void> {
  const path = `users/${userId}`;
  try {
    await setDoc(
      doc(db, 'users', userId),
      {
        uid: userId,
        email,
        displayName,
        role,
        isProSubscriber,
        lastActive: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path, auth.currentUser);
  }
}
