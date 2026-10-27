import React from "react";
export function LandingPage({
  onLogin,
  error,
  onRetry,
  signingIn,
}: {
  onLogin: () => void;
  error: string;
  onRetry: () => void;
  signingIn: boolean;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-amber-500/20 p-6 flex justify-between">
        <strong className="font-serif text-amber-300 text-xl">
          IATheos Pro
        </strong>
        <button disabled={signingIn} onClick={onLogin}>
          {signingIn ? "Abrindo login…" : "Entrar com Google"}
        </button>
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
        <button
          disabled={signingIn}
          onClick={onLogin}
          className="bg-amber-600 px-8 py-4 rounded-xl font-bold"
        >
          {signingIn ? "Abrindo login…" : "Entrar com Google"}
        </button>
        <p className="mt-4 text-sm text-slate-400">
          Acesso concedido pelo administrador. Compras e cobranças ainda não
          estão disponíveis.
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
