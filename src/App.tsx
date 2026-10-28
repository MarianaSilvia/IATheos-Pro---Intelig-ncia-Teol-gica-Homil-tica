import React, { useState, useEffect, lazy, Suspense } from "react";
import { useSession } from "./hooks/useSession";
import { useResource } from "./hooks/useResource";
import { useLibrary } from "./hooks/useLibrary";
import { api } from "./lib/api";
import type { Session } from "./shared/contracts";
import type { SermonOutline, EbdLesson, VerseXray } from "./utils/theology";
import { Navbar, type TabType } from "./components/Navbar";
const DashboardView = lazy(() =>
  import("./components/DashboardView").then((m) => ({
    default: m.DashboardView,
  })),
);
import { DashboardModals } from "./components/DashboardModals";
const SermonView = lazy(() =>
  import("./components/SermonView").then((m) => ({ default: m.SermonView })),
);
const EbdView = lazy(() =>
  import("./components/EbdView").then((m) => ({ default: m.EbdView })),
);
const VerseXrayView = lazy(() =>
  import("./components/VerseXrayView").then((m) => ({
    default: m.VerseXrayView,
  })),
);
const BibleAndHarpView = lazy(() =>
  import("./components/BibleAndHarpView").then((m) => ({
    default: m.BibleAndHarpView,
  })),
);
import { StoreViewRestored } from "./components/StoreViewRestored";
const AdminPanelView = lazy(() =>
  import("./components/AdminPanelView").then((m) => ({
    default: m.AdminPanelView,
  })),
);
const TheologicalChatView = lazy(() =>
  import("./components/TheologicalChatView").then((m) => ({
    default: m.TheologicalChatView,
  })),
);
import {
  SavedLibraryView,
  type SavedItem,
} from "./components/SavedLibraryView";
import { PulpitModeModal } from "./components/PulpitModeModal";
import { PdfReaderModal } from "./components/PdfReaderModal";
import { LandingPage } from "./components/LandingPage/LandingPage";
import type { DigitalProduct } from "./utils/ecosystem";
export default function App() {
  const { session, loading, error, signingIn, loginAdmin, requestMagicLink, logout, refresh } =
    useSession();
  const [publicProducts, setPublicProducts] = useState<Array<{id:string;title:string;price:number}>>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<Array<{id:string;name:string;price:number;durationDays:number}>>([]);
  useEffect(() => {
    void Promise.all([
      fetch("/api/public/products").then((r) => r.ok ? r.json() : []),
      fetch("/api/public/subscription-plans").then((r) => r.ok ? r.json() : []),
    ]).then(([products, plans]) => { setPublicProducts(products); setSubscriptionPlans(plans); }).catch(() => undefined);
  }, []);
  if (loading)
    return (
      <div role="status" className="p-12 text-center">
        Verificando sessão…
      </div>
    );
  if (!session)
    return (
      <LandingPage
        signingIn={signingIn}
        products={publicProducts}
        plans={subscriptionPlans}
        onInterest={async (email, productId) => { const response = await fetch("/api/purchase-interest", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, productId, consent: true }) }); const body = await response.json().catch(() => ({})); if (!response.ok) throw new Error(body.error || "Não foi possível iniciar o pedido."); if (body.checkoutUrl) window.location.assign(body.checkoutUrl); }}
        onSubscriptionInterest={async (email, planId) => { const response = await fetch("/api/subscription-interest", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, planId, consent: true }) }); const body = await response.json().catch(() => ({})); if (!response.ok) throw new Error(body.error || "Não foi possível iniciar a assinatura."); if (body.checkoutUrl) window.location.assign(body.checkoutUrl); }}
        onLoginWithEmail={async (email) => { await requestMagicLink(email); }}
        onAdminLogin={async (email, password) => { await loginAdmin(email, password); }}
        error={error}
        onRetry={() => void refresh()}
      />
    );
  return (
    <Workspace
      key={session.uid}
      session={session}
      logout={() => void logout()}
    />
  );
}
function Workspace({
  session,
  logout,
}: {
  session: Session;
  logout: () => void;
}) {
  const [tab, setTab] = useState<TabType>("dashboard");
  const [sermon, setSermon] = useState<SermonOutline | null>(null);
  const [lesson, setLesson] = useState<EbdLesson | null>(null);
  const [xray, setXray] = useState<VerseXray | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [pulpit, setPulpit] = useState(false);
  const [reader, setReader] = useState<DigitalProduct | null>(null);
  const [modal, setModal] = useState<
    "themes" | "dictionary" | "concordance" | "notes" | null
  >(null);
  const [bible, setBible] = useState({ book: "Romanos", chapter: 5 });
  const [access, setAccess] = useState(session);
  useEffect(() => setAccess(session), [session]);
  const library = useLibrary();
  const catalog = useResource<DigitalProduct[]>("/products", []);
  const run = async (action: () => Promise<unknown>, success?: string) => {
    try {
      await action();
      if (success) setMessage(success);
    } catch (e) {
      setMessage((e as Error).message);
    }
  };
  const generate = async (type: "sermon" | "ebd" | "xray", params: unknown) => {
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      const result: any = await api(
        "/theology/" + (type === "xray" ? "verse-xray" : type),
        { method: "POST", body: JSON.stringify(params) },
      );
      const { generatedSchemas } = await import("./shared/contracts");
      generatedSchemas[type].parse(
        Object.fromEntries(
          Object.entries(result).filter(
            ([k]) => k !== "id" && k !== "createdAt",
          ),
        ),
      );
      if (type === "sermon") setSermon(result);
      else if (type === "ebd") setLesson(result);
      else setXray(result);
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const generateSermon = (params: any) => {
    setTab("sermons");
    return generate("sermon", params);
  };
  const generateXray = (verseReference: string) => {
    setTab("xray");
    return generate("xray", {
      verseReference,
      translation: "Almeida Revista e Atualizada (ARA)",
    });
  };
  const toggleSave = (type: SavedItem["type"], data: SavedItem["data"]) =>
    void run(
      () =>
        library.data.some((i) => i.id === data.id)
          ? library.remove(data.id)
          : library.save(type, data),
      "Caderno atualizado na nuvem.",
    );
  const select = (item: SavedItem) => {
    if (item.type === "sermon") {
      setSermon(item.data as SermonOutline);
      setTab("sermons");
    } else if (item.type === "ebd") {
      setLesson(item.data as EbdLesson);
      setTab("ebd");
    } else {
      setXray(item.data as VerseXray);
      setTab("xray");
    }
  };
  const exportAll = () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(library.data, null, 2)], {
        type: "application/json",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "caderno-ministerial.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const formOnly = (title: string, type: "sermon" | "ebd" | "xray") => (
    <InitialGenerator
      title={title}
      busy={busy}
      onGenerate={(value) =>
        generate(
          type,
          type === "xray"
            ? { verseReference: value, translation: "ARA" }
            : {
                biblicalText: value,
                targetAudience: type === "ebd" ? "Adultos" : "Culto Geral",
                ...(type === "sermon" ? { sermonType: "Expositivo" } : {}),
              },
        )
      }
    />
  );
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar
        activeTab={tab}
        setActiveTab={setTab}
        onOpenPulpitMode={() =>
          sermon
            ? setPulpit(true)
            : setMessage("Gere ou abra um sermão primeiro.")
        }
        savedCount={library.data.length}
        userRole={access.isAdmin ? "admin" : "buyer"}
        isProSubscriber={access.isProSubscriber}
      />
      <div className="bg-slate-900 text-slate-200 px-6 py-3 flex flex-wrap justify-between gap-3 no-print">
        <span>
          {access.displayName || access.email} ·{" "}
          {access.isAdmin
            ? "Administrador"
            : access.isProSubscriber
              ? "Acesso ativo"
              : "Acesso inativo"}
        </span>
        <div className="flex gap-4">
          <button
            onClick={() =>
              void run(async () => setAccess(await api<Session>("/session")))
            }
          >
            Atualizar acesso
          </button>
          <button onClick={logout}>Sair</button>
        </div>
      </div>
      {!access.isProSubscriber && (
        <p className="bg-amber-100 p-4">
          Solicite ao administrador a concessão de acesso. A cobrança está
          desativada nesta etapa.
        </p>
      )}
      {message && (
        <div role="status" className="p-4 bg-amber-50 flex justify-between">
          {message}
          <button onClick={() => setMessage("")} aria-label="Fechar aviso">
            ×
          </button>
        </div>
      )}
      {(library.error || catalog.error) && (
        <div role="alert" className="p-4 bg-red-50">
          {library.error || catalog.error}{" "}
          <button
            onClick={() => {
              void library.reload();
              void catalog.reload();
            }}
          >
            Tentar novamente
          </button>
        </div>
      )}
      <main className="max-w-7xl mx-auto p-4 sm:p-8">
        <Suspense fallback={<p role="status">Carregando módulo…</p>}>
          {tab === "dashboard" && (
            <DashboardView
              displayName={access.displayName}
              savedCount={library.data.length}
              onNavigateTab={setTab}
              onOpenModal={setModal}
              onNavigateToBible={(book, chapter) => {
                setBible({ book, chapter });
                setTab("bible_harp");
              }}
            />
          )}
          {tab === "sermons" &&
            (sermon ? (
              <SermonView
                currentSermon={sermon}
                onSaveSermon={(s) => toggleSave("sermon", s)}
                isSaved={library.data.some((i) => i.id === sermon.id)}
                onOpenPulpitMode={() => setPulpit(true)}
                onGenerateSermon={generateSermon}
                isLoading={busy}
              />
            ) : (
              formOnly("Criar esboço de sermão", "sermon")
            ))}
          {tab === "ebd" &&
            (lesson ? (
              <EbdView
                currentLesson={lesson}
                onSaveLesson={(l) => toggleSave("ebd", l)}
                isSaved={library.data.some((i) => i.id === lesson.id)}
                onGenerateLesson={(params) => generate("ebd", params)}
                isLoading={busy}
              />
            ) : (
              formOnly("Preparar aula de EBD", "ebd")
            ))}
          {tab === "xray" &&
            (xray ? (
              <VerseXrayView
                currentXray={xray}
                onSaveXray={(x) => toggleSave("xray", x)}
                isSaved={library.data.some((i) => i.id === xray.id)}
                onGenerateXray={(params) => generate("xray", params)}
                isLoading={busy}
              />
            ) : (
              formOnly("Analisar um versículo", "xray")
            ))}
          {tab === "bible_harp" && (
            <BibleAndHarpView
              key={bible.book + ":" + bible.chapter}
              initialBook={bible.book}
              initialChapter={bible.chapter}
              onSendToVerseXray={(v) => void generateXray(v)}
            />
          )}
          {tab === "store" && (
            <StoreViewRestored
              products={catalog.data}
              isProSubscriber={access.isProSubscriber}
              onOpenPdfReader={setReader}
            />
          )}
          {tab === "chat" && (
            <TheologicalChatView
              isLoading={false}
              onSendMessage={async (message, history) => {
                const result = await api<{ reply: string }>("/theology/chat", {
                  method: "POST",
                  body: JSON.stringify({
                    message,
                    history: history
                      .filter((i) => i.id !== "welcome")
                      .slice(-12)
                      .map(({ sender, text }) => ({ sender, text })),
                  }),
                });
                return result.reply;
              }}
            />
          )}
          {tab === "library" && (
            <>
              <p className="text-sm mb-3">
                {library.loading ? "Carregando caderno…" : ""}
              </p>
              <SavedLibraryView
                savedItems={library.data}
                onSelectItem={select}
                onDeleteItem={(id) =>
                  void run(
                    () => library.remove(id),
                    "Estudo excluído da nuvem.",
                  )
                }
                onExportAll={exportAll}
              />
            </>
          )}
          {tab === "admin" && access.isAdmin && (
            <AdminPanelView
              products={catalog.data}
              onRefresh={catalog.reload}
            />
          )}
        </Suspense>
      </main>
      <DashboardModals
        modalType={modal}
        onClose={() => setModal(null)}
        onNavigateToSermon={(text, theme) => {
          setModal(null);
          void generateSermon({ biblicalText: text, theme });
        }}
        onNavigateToXray={(verse) => {
          setModal(null);
          void generateXray(verse);
        }}
      />
      {pulpit && sermon && (
        <PulpitModeModal sermon={sermon} onClose={() => setPulpit(false)} />
      )}
      {reader && (
        <PdfReaderModal
          product={reader}
          onClose={() => {
            setReader(null);
            void catalog.reload();
          }}
        />
      )}
      <footer className="text-center p-8 text-slate-500 no-print">
        IATheos Pro · Estudos e preparo ministerial
      </footer>
    </div>
  );
}
function InitialGenerator({
  title,
  busy,
  onGenerate,
}: {
  title: string;
  busy: boolean;
  onGenerate: (text: string) => Promise<unknown>;
}) {
  const [text, setText] = useState("");
  return (
    <form
      className="bg-white p-8 rounded-3xl border space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (text.trim()) void onGenerate(text.trim());
      }}
    >
      <h1 className="text-2xl font-serif font-bold">{title}</h1>
      <label className="block">
        Texto bíblico ou referência
        <input
          required
          maxLength={300}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="block w-full border p-3 rounded-xl mt-2"
          placeholder="Ex.: Romanos 5:3-5"
        />
      </label>
      <button
        disabled={busy}
        className="bg-amber-600 text-white px-6 py-3 rounded-xl disabled:opacity-50"
      >
        {busy ? "Gerando…" : "Gerar conteúdo"}
      </button>
    </form>
  );
}
