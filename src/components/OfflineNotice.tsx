import React, { useEffect, useState } from "react";

export function OfflineNotice() {
  const [offline, setOffline] = useState(() => typeof navigator !== "undefined" && !navigator.onLine);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!offline) return null;
  return <div role="status" className="fixed inset-x-0 top-0 z-[100] bg-slate-900 text-amber-100 px-4 py-2 text-center text-sm shadow-lg">Você está offline. A interface e o conteúdo local continuam disponíveis; sincronização, login e operações privadas voltarão quando a conexão retornar.</div>;
}
