import { initializeApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  GoogleAuthProvider,
} from "firebase/auth";
import existingConfig from "../../firebase-applet-config.json";
const local = import.meta.env.VITE_USE_FIREBASE_EMULATORS !== "false";
if (!local && import.meta.env.VITE_ALLOW_REMOTE_FIREBASE !== "true")
  throw new Error("Firebase remoto desativado nesta etapa.");
export const app = initializeApp(
  local
    ? {
        projectId: "demo-iatheos",
        apiKey: "demo-key",
        authDomain: "demo-iatheos.firebaseapp.com",
      }
    : existingConfig,
);
export const auth = getAuth(app);
if (local)
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
export const googleProvider = new GoogleAuthProvider();
