import React, { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPwaButton() {
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const handlePrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handlePrompt);
    return () => window.removeEventListener("beforeinstallprompt", handlePrompt);
  }, []);

  if (!installEvent) return null;
  return <button type="button" disabled={busy} onClick={async () => { setBusy(true); try { await installEvent.prompt(); await installEvent.userChoice; setInstallEvent(null); } finally { setBusy(false); } }} className="fixed bottom-4 right-4 z-40 rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-slate-950 shadow-xl disabled:opacity-60">{busy ? "Abrindo instalação…" : "Instalar Verbo Norte"}</button>;
}
