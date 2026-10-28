import React from "react";
export function LandingPage({
  onLogin,
  products,
  plans,
  onInterest,
  onSubscriptionInterest,
  error,
  onRetry,
  signingIn,
}: {
  onLogin: (email: string, password: string, mode: "buyer" | "admin") => Promise<void>;
  products: Array<{ id: string; title: string; price: number }>;
  plans: Array<{ id: string; name: string; price: number; durationDays: number }>;
  onInterest: (email: string, productId: string) => Promise<void>;
  onSubscriptionInterest: (email: string, planId: string) => Promise<void>;
  error: string;
  onRetry: () => void;
  signingIn: boolean;
}) {
  const [mode, setMode] = React.useState<"buyer" | "admin">("buyer");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [productId, setProductId] = React.useState("");
  const [purchaseKind, setPurchaseKind] = React.useState<"material" | "subscription">("subscription");
  const [planId, setPlanId] = React.useState("annual");
  const submit = (event: React.FormEvent) => { event.preventDefault(); setSent(false); const action = mode === "admin" ? onLogin(email.trim(), password, mode) : purchaseKind === "subscription" ? onSubscriptionInterest(email.trim(), planId) : onInterest(email.trim(), productId); void action.then(() => { if (mode === "buyer") setSent(true); }); };
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-amber-500/20 p-6 flex justify-between">
        <strong className="font-serif text-amber-300 text-xl">
          IATheos Pro
        </strong>
        <button disabled={signingIn} onClick={() => setMode(mode === "buyer" ? "admin" : "buyer")}>{mode === "buyer" ? "Acesso administrativo" : "Acesso de comprador"}</button>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-20">
        <span className="text-amber-400 uppercase tracking-widest text-sm">
          Estudo bíblico e preparo ministerial
        </span>
        <h1 className="text-5xl font-serif font-bold mt-6 leading-tight">
          Profundidade no estudo.
          <br />
          Clareza para ensinar.
        </h1>
        <p className="text-slate-300 my-8 max-w-2xl text-lg">
          Prepare sermões, aulas de EBD e análises bíblicas. Organize seus
          estudos e materiais em uma biblioteca pessoal.
        </p>
        <form onSubmit={submit} className="max-w-md bg-white text-slate-900 rounded-2xl p-6 space-y-4">
          <h2 className="font-bold">{mode === "buyer" ? "Entrar com e-mail" : "Entrar como administrador"}</h2>
          <input required type="email" autoComplete="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full border p-3 rounded-xl" />
          {mode === "buyer" && <>
            <div className="flex gap-2 text-sm">
              <button type="button" className={`flex-1 rounded-xl border p-2 ${purchaseKind === "subscription" ? "bg-amber-100 border-amber-500" : ""}`} onClick={() => setPurchaseKind("subscription")}>Assinar</button>
              <button type="button" className={`flex-1 rounded-xl border p-2 ${purchaseKind === "material" ? "bg-amber-100 border-amber-500" : ""}`} onClick={() => setPurchaseKind("material")}>Comprar material</button>
            </div>
            {purchaseKind === "subscription" ? <label className="block text-sm">Plano<select required value={planId} onChange={(e) => setPlanId(e.target.value)} className="mt-1 block w-full border p-3 rounded-xl">{plans.map((p) => <option key={p.id} value={p.id}>{p.name} — R$ {p.price.toFixed(2).replace(".", ",")}</option>)}</select></label> : <label className="block text-sm">Material de interesse<select required value={productId} onChange={(e) => setProductId(e.target.value)} className="mt-1 block w-full border p-3 rounded-xl"><option value="">Selecione um material</option>{products.map((p) => <option key={p.id} value={p.id}>{p.title} — R$ {p.price.toFixed(2).replace(".", ",")}</option>)}</select></label>}
          </>}
          {mode === "admin" && <input required minLength={8} type="password" autoComplete="current-password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full border p-3 rounded-xl" />}
          <button disabled={signingIn} className="bg-amber-600 text-white px-8 py-4 rounded-xl font-bold disabled:opacity-50">{signingIn ? "Processando…" : mode === "buyer" ? purchaseKind === "subscription" ? "Assinar e pagar" : "Comprar material" : "Entrar"}</button>
          {sent && <p role="status" className="text-emerald-700">Se o e-mail estiver aprovado, enviamos o link de acesso.</p>}
        </form>
        <p className="mt-4 text-sm text-slate-400">
          O acesso da assinatura é ativado automaticamente após a confirmação do pagamento. O link mágico será enviado ao e-mail cadastrado.
        </p>
        {error && (
          <div role="alert" className="p-4 bg-red-950 mt-6 rounded-xl">
            {error}{" "}
            <button className="underline" onClick={onRetry}>
              Tentar novamente
            </button>
          </div>
        )}
        <div className="grid sm:grid-cols-3 gap-5 mt-16">
          {["Sermões", "Aulas de EBD", "Caderno e biblioteca"].map((label) => (
            <div
              key={label}
              className="border border-slate-800 p-6 rounded-2xl"
            >
              {label}
            </div>
          ))}
        </div>
        <p className="mt-10 text-slate-400">
          Sua conta e seus estudos são pessoais.
        </p>
      </main>
    </div>
  );
}
