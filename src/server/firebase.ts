import { config } from "./config.ts";
import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
const app =
  getApps()[0] ||
  initializeApp({ projectId: config.projectId, storageBucket: config.bucket });
export const adminAuth = getAuth(app);
export const firestore = getFirestore(app, config.databaseId!);
export const bucket = getStorage(app).bucket();
