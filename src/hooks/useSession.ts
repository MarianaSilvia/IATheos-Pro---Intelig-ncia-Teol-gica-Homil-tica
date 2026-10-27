import { useEffect, useRef, useState } from "react";
import { onIdTokenChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { api } from "../lib/api";
import type { Session } from "../shared/contracts";
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const loginInFlight = useRef(false);
  const version = useRef(0);
  const identity = useRef<string | null>(null);
  async function refresh() {
    const seq = ++version.current;
    const uid = auth.currentUser?.uid || null;
    if (identity.current !== uid) {
      setLoading(true);
      setSession(null);
      identity.current = uid;
    }
    setError("");
    try {
      if (auth.currentUser) {
        const data = await api<Session>("/users/sync", { method: "POST" });
        if (seq === version.current) setSession(data);
      }
    } catch (e) {
      if (seq === version.current) {
        setSession(null);
        setError((e as Error).message);
      }
    } finally {
      if (seq === version.current) setLoading(false);
    }
  }
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, () => {
      void refresh();
    });
    return () => {
      version.current++;
      unsubscribe();
    };
  }, []);
  return {
    session,
    loading,
    error,
    signingIn,
    refresh,
    login: async () => {
      if (loginInFlight.current) return;
      loginInFlight.current = true;
      setSigningIn(true);
      setError("");
      let timer: ReturnType<typeof setTimeout> | undefined;
      try {
        await Promise.race([
          signInWithPopup(auth, googleProvider),
          new Promise<never>((_, reject) => {
            timer = setTimeout(
              () =>
                reject(
                  new Error(
                    "Não foi possível abrir o login Google. Confira a conexão e a permissão de popups e tente novamente.",
                  ),
                ),
              30000,
            );
          }),
        ]);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        if (timer) clearTimeout(timer);
        loginInFlight.current = false;
        setSigningIn(false);
      }
    },
    logout: async () => {
      version.current++;
      setSession(null);
      await signOut(auth);
    },
  };
}
